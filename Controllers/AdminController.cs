using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InterviewApi.Data;
using InterviewApi.Models;
using InterviewApi.DTOs;
using InterviewApi.Utils;
using InterviewApi.Services;
using QRCoder;
using System.Drawing;
using System.IO;
using System;
using System.Linq;
using System.Threading.Tasks;
using QuestPDF.Infrastructure;
namespace InterviewApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // ✅ Entire controller locked for Admin role
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public AdminController(ApplicationDbContext context, IEmailService emailService, IConfiguration configuration)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
        }

        // ✅ All endpoints now require JWT token with Admin role

        // ----------------- Login Admin -----------------
        [Authorize(Roles = "Admin")]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AdminLoginDto dto)
        {
            var adminUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.Role == "Admin");
            if (adminUser == null || !PasswordHasher.VerifyPassword(dto.Password, adminUser.PasswordHash))
                return Unauthorized("Invalid credentials.");

            // Secret Key verify
            if (!PasswordHasher.VerifyPassword(dto.SecretKey, adminUser.SecretKeyHash))
                return Unauthorized("Invalid secret key.");

            var token = JwtTokenGenerator.GenerateToken(adminUser, _configuration, true);
            return Ok(new
            {
                token,
                user = new { adminUser.UserId, adminUser.Email, adminUser.FullName, adminUser.Role }
            });
        }

        private IActionResult CheckSecondLogin()
        {
            var adminSecondLoginClaim = User.FindFirst("AdminSecondLogin");
            if (adminSecondLoginClaim == null || adminSecondLoginClaim.Value != "true")
            {
                return StatusCode(403, new { message = "as you are admin, twice login required! please login once more" });
            }
            return null;
        }

        // 1. Get all Interviewers

        [HttpGet("interviewers")]
        public async Task<IActionResult> GetInterviewers()
        {
            var check = CheckSecondLogin();
            if (check != null) return check;

            var data = await _context.Interviewers
                .Include(i => i.User)
                .Select(i => new
                {
                    Id = i.Id,
                    Name = i.User.FullName,
                    Email = i.User.Email,
                    SkillSet = i.SkillSet,
                    Level = i.Level,
                    YearsOfExperience = i.YearsOfExperience,
                    InterviewType = i.InterviewType,
                    MaxCandidates = i.MaxCandidates,
                    IsAvailable = i.IsAvailable
                }).ToListAsync();

            return Ok(data);
        }





        // 2. Get all Candidates
        [HttpGet("candidates")]
        public async Task<IActionResult> GetCandidates()
        {

            var check = CheckSecondLogin();
            if (check != null) return check;


            var data = await _context.Candidates.Include(c => c.User).ToListAsync();
            return Ok(data);
        }


        [HttpGet("check-all-resumes")]
        public async Task<IActionResult> GetAllCandidatesForResume()
        {
            var candidates = await _context.Candidates
                .Select(c => new
                {
                    c.CandidateId,
                    c.Name,
                    c.Email,
                    c.SkillSet,
                    c.TotalYearsOfExperience
                })
                .ToListAsync();

            if (!candidates.Any())
                return Ok(new { message = "No candidates found" });

            return Ok(candidates);
        }

        // 3. Decide how many Candidates each Interviewer can handle

        [HttpPost("set-max-candidates")]
        public async Task<IActionResult> SetMaxCandidates([FromBody] MaxCandidateDto dto)
        {
            var check = CheckSecondLogin();
            if (check != null) return check;
            var interviewer = await _context.Interviewers.FindAsync(dto.InterviewerId);
            if (interviewer == null) return NotFound("Interviewer not found.");
            interviewer.MaxCandidates = dto.MaxCandidates;
            await _context.SaveChangesAsync();
            return Ok(new { message = $"Max candidates updated to {dto.MaxCandidates}" });
        }

        // 4. Ensure secure password storage (hashed) for Users
        [HttpGet("hash-passwords")]
        public async Task<IActionResult> HashPasswords()
        {
            var check = CheckSecondLogin();
            if (check != null) return check;

            var users = await _context.Users
                .Where(u => !string.IsNullOrEmpty(u.PasswordHash) && u.PasswordHash.Length < 64)
                .ToListAsync();
            foreach (var u in users)
            {
                u.PasswordHash = PasswordHasher.HashPassword(u.PasswordHash!);
            }
            await _context.SaveChangesAsync();
            return Ok(new { message = $"{users.Count} user passwords hashed successfully." });
        }

        //get resume 
        [HttpGet("candidate/{candidateId}/resume")]
        public async Task<IActionResult> DownloadCandidateResume(int candidateId)
        {
            var check = CheckSecondLogin();
            if (check != null) return check;
            var candidate = await _context.Candidates.FindAsync(candidateId);
            if (candidate == null || string.IsNullOrEmpty(candidate.ResumePath) || !System.IO.File.Exists(candidate.ResumePath))
                return NotFound("Resume not found.");

            var fileBytes = await System.IO.File.ReadAllBytesAsync(candidate.ResumePath);
            var fileName = Path.GetFileName(candidate.ResumePath);
            var contentType = "application/octet-stream"; // Or use a MIME type library for better accuracy

            return File(fileBytes, contentType, fileName);
        }

        // 5. Assign Interviewer → Candidate (with level)

        // ✅ 1. Assign Interviewer to Candidate



        [HttpPost("assign-interviewer-to-candidate")]
        public async Task<IActionResult> AssignInterviewer([FromBody] AssignDto dto)
        {
            var check = CheckSecondLogin();
            if (check != null) return check;

            var candidate = await _context.Candidates.FindAsync(dto.CandidateId);
            if (candidate == null) return NotFound("Candidate not found.");

            // Candidate eligibility checks
            if (candidate.InterviewStatus != "NotAssigned")
                return BadRequest("Candidate is not eligible for interviewer assignment.");

            if (candidate.AssignedInterviewerId != null)
                return BadRequest("Candidate already assigned to an interviewer.");

            if (dto.ScheduledDate == default || dto.ScheduledDate < DateTime.Now)
                return BadRequest("Invalid interview date.");

            // Parse candidate experience
            int candidateExperience = 0;
            if (!string.IsNullOrEmpty(candidate.TotalYearsOfExperience))
                int.TryParse(candidate.TotalYearsOfExperience, out candidateExperience);

            // Candidate skills
            var candidateSkills = candidate.SkillSet?
                .Split(new[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim().ToLower())
                .ToList() ?? new List<string>();

            // Fetch suitable interviewers
            var interviewers = await _context.Interviewers
                .Where(i => i.IsAvailable == true)
                .ToListAsync();

            var suitableInterviewers = interviewers.Where(i =>
                candidateSkills.Any(skill =>
                    i.SkillSet.Split(new[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(s => s.Trim().ToLower())
                    .Contains(skill)
                ) &&
                (candidateExperience <= 2 || i.Level.Equals("L2", StringComparison.OrdinalIgnoreCase))
            ).ToList();

            if (!suitableInterviewers.Any())
                return BadRequest("No suitable interviewer found for this candidate.");

            // ✅ Validate selected interviewer is in suitable list
            var interviewer = suitableInterviewers.FirstOrDefault(i => i.Id == dto.InterviewerId);
            if (interviewer == null)
                return BadRequest("Selected interviewer is not suitable for this candidate.");

            // Max candidate limit check
            var count = await _context.Interviews.CountAsync(i =>
                i.InterviewerId == interviewer.Id && i.Status == "Scheduled");
            if (count >= interviewer.MaxCandidates)
                return BadRequest("This interviewer has reached max candidate limit.");

            // Assign interview
            var interview = new Interview
            {
                InterviewerId = interviewer.Id,
                CandidateId = candidate.CandidateId,
                Level = interviewer.Level,
                Status = "Scheduled",
                ScheduledAt = dto.ScheduledDate // ✅ Local time will be converted automatically if API runs in UTC
            };

            _context.Interviews.Add(interview);
            candidate.AssignedInterviewerId = interviewer.Id;
            candidate.InterviewStatus = "Assigned";

            await _context.SaveChangesAsync();

            // Generate visitor code and QR
            string visitorCode = Guid.NewGuid().ToString().Substring(0, 8);
            //string qrBase64 = GenerateQrCode(visitorCode);

            // Send email
            await SendInterviewEmail(candidate, interviewer, dto.ScheduledDate, visitorCode);

            return Ok(new
            {
                message = "Interviewer assigned successfully.",
                CandidateExperience = candidateExperience,
                InterviewerLevel = interviewer.Level,
                AssignedInterviewer = interviewer.Name,

                VisitorCode = visitorCode,
                // QrCodeImage = $"data:image/png;base64,{qrBase64}"

            });
        }



        [HttpGet("get-suitable-interviewers/{candidateId}")]
        public async Task<IActionResult> GetSuitableInterviewers(int candidateId)
        {
            var check = CheckSecondLogin();
            if (check != null) return check;

            var candidate = await _context.Candidates.FindAsync(candidateId);
            if (candidate == null) return NotFound("Candidate not found.");

            var candidateSkills = candidate.SkillSet?
                .Split(new[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim().ToLower())
                .ToList() ?? new List<string>();

            int experience = 0;
            if (!string.IsNullOrEmpty(candidate.TotalYearsOfExperience))
            {
                int.TryParse(candidate.TotalYearsOfExperience, out experience);
            }

            var interviewers = await _context.Interviewers
                .Where(i => i.IsAvailable == true)
                .ToListAsync();

            var suitableInterviewers = interviewers.Where(i =>
                candidateSkills.Any(skill =>
                    i.SkillSet.Split(new[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(s => s.Trim().ToLower())
                    .Contains(skill)
                ) &&
                (experience <= 2 || i.Level.Equals("L2", StringComparison.OrdinalIgnoreCase))
            ).Select(i => new
            {
                i.Id,
                i.Name,
                i.Email,
                i.SkillSet,
                i.Level,
                i.YearsOfExperience
            }).ToList();

            return Ok(suitableInterviewers);
        }




        // ✅ Helper Method: Generate QR Code

        // private string GenerateQrCode(string visitorCode)
        // {
        //     using (QRCodeGenerator qrGenerator = new QRCodeGenerator())
        //     {
        //         QRCodeData qrCodeData = qrGenerator.CreateQrCode(visitorCode, QRCodeGenerator.ECCLevel.Q);
        //         using (QRCode qrCode = new QRCode(qrCodeData))
        //         {
        //             using (Bitmap qrBitmap = qrCode.GetGraphic(20))
        //             {
        //                 using (MemoryStream ms = new MemoryStream())
        //                 {
        //                     qrBitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
        //                     return Convert.ToBase64String(ms.ToArray()); // ✅ Base64 for embedding
        //                 }
        //             }
        //         }
        //     }
        // }


        // ✅ Helper Method: Send Email with QR

        private async Task SendInterviewEmail(Candidate candidate, Interviewer interviewer, DateTime scheduledDate, string visitorCode)
        {
            string subject = "Interview Scheduled";

            // ✅ HTML email body with inline QR image
            string htmlBody = $@"
    <div style='font-family:Segoe UI,Arial,sans-serif;font-size:15px;color:#222;'>
        <h2 style='color:#2d6cdf;'>Interview Scheduled</h2>
        <p>Dear {candidate.Name},</p>
        <p>Your interview is scheduled on <b>{scheduledDate:dd MMM yyyy HH:mm}</b>.</p>
        <p><b>Interviewer:</b> {interviewer.Name}</p>
        <p><b>Visitor Code:</b> {visitorCode}</p>
        <p style='color:green;'>Please show this visitor code for entry.</p>
        <p style='color:green;'>Give your best!!!</p>
    </div>";

            // ✅ Send email as HTML
            await _emailService.SendEmailAsync(candidate.Email, subject, htmlBody);
        }


        //reschedule 

        [HttpGet("rescheduled-candidates")]
        public async Task<IActionResult> GetRescheduledCandidates()
        {
            var candidates = await _context.Candidates
                .Where(c => c.InterviewStatus == "Interview Rescheduled")
                .Join(_context.Interviewers,
                      c => c.AssignedInterviewerId,
                      i => i.Id,
                      (c, i) => new
                      {
                          CandidateId = c.CandidateId,
                          CandidateName = c.Name,
                          CandidateEmail = c.Email,
                          AssignedInterviewerId = i.Id,
                          AssignedInterviewerName = i.Name,
                          InterviewStatus = c.InterviewStatus
                      })
                .ToListAsync();

            if (!candidates.Any())
                return Ok(new { message = "No rescheduled candidates found." });

            return Ok(candidates);
        }



        [HttpGet("eligible-candidates-for-assignment")]
        public async Task<IActionResult> GetEligibleCandidatesForAssignment()
        {
            var candidates = await _context.Candidates
                .Where(c => c.InterviewStatus == "NotAssigned") // ✅ Only those not assigned yet
                .Select(c => new
                {
                    c.CandidateId,
                    c.Name,
                    c.Email,
                    c.SkillSet,
                    c.TotalYearsOfExperience
                })
                .ToListAsync();

            if (!candidates.Any())
                return Ok(new { message = "No candidates found" });

            return Ok(candidates);
        }


        // 7. Send final result emails after interviews
        [HttpPost("send-final-results")]
        public async Task<IActionResult> SendFinalResults([FromBody] List<OfferLetterDto> offers)
        {
            int successCount = 0, failureCount = 0;

            foreach (var offer in offers)
            {
                // Find interview for this candidate
                var interview = await _context.Interviews
                    .Include(i => i.Candidate)
                    .FirstOrDefaultAsync(i => i.CandidateId == offer.CandidateId &&
                                              (i.Result == "Accepted" || i.Result == "Rejected"));

                if (interview == null)
                {
                    failureCount++;
                    continue;
                }

                string subject = interview.Result == "Accepted"
                    ? "🎉 Congratulations! You have been shortlisted."
                    : "Interview Update - Application Rejected";

                // Beautified HTML email body
                string body = interview.Result == "Accepted"
                    ? $@"
                <div style='font-family:Segoe UI,Arial,sans-serif;font-size:15px;color:#222;'>
                    <p>Dear {offer.CandidateName},</p>
                    <p>
                        Congratulations! We are delighted to inform you that you have been <b>selected</b> for the position of <b>{offer.Position}</b>.<br/>
                        Please find your offer letter attached with this email.<br/>
                        Kindly let us know your decision regarding acceptance or rejection of this offer letter by <b>this week</b>.
                    </p>
                    <p>
                        <b>Best Regards,</b><br/>
                        <span style='color:#2d6cdf;'>Interview Management Team</span>
                    </p>
                </div>"
                    : $@"
                <div style='font-family:Segoe UI,Arial,sans-serif;font-size:15px;color:#222;'>
                    <p>Dear {offer.CandidateName},</p>
                    <p>
                        Thank you for your time and interest in our organization.<br/>
                        Unfortunately, you have not been selected for the position of <b>{offer.Position}</b>.<br/>
                        We wish you all the best in your future endeavors.
                    </p>
                    <p>
                        <b>Best wishes,</b><br/>
                        <span style='color:#2d6cdf;'>Interview Management Team</span>
                    </p>
                </div>";

                try
                {
                    if (interview.Result == "Accepted")
                    {
                        // Generate a beautiful Offer Letter PDF
                        QuestPDF.Settings.License = LicenseType.Community;
                        var generator = new OfferLetterGenerator();
                        var pdfBytes = generator.GenerateOfferLetter(offer.CandidateName, offer.Position, offer.Salary);

                        await _emailService.SendEmailWithAttachmentAsync(
                            offer.Email,
                            subject,
                            body,
                            pdfBytes,
                            $"{offer.CandidateName}_OfferLetter.pdf"
                        );
                    }
                    else
                    {
                        await _emailService.SendEmailAsync(offer.Email, subject, body);
                    }

                    successCount++;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Email sending failed: {ex.Message}");
                    failureCount++;
                }
            }

            return Ok(new { message = $"{successCount} emails sent successfully, {failureCount} failed." });
        }



        [HttpGet("eligible-candidates")]
        public async Task<IActionResult> GetEligibleCandidates()
        {
            var candidates = await _context.Candidates
                .Where(c => _context.Interviews.Any(i =>
                    i.CandidateId == c.CandidateId &&
                    i.Result == "Accepted") // ✅ Removed Status check
                    && !c.OfferGenerated)
                .Select(c => new
                {
                    c.CandidateId,
                    c.Name,
                    c.Email,
                    c.SkillSet,
                    c.TotalYearsOfExperience
                })
                .ToListAsync();

            if (!candidates.Any())
                return Ok(new { message = "No candidates found" });

            return Ok(candidates);
        }


        [HttpGet("eligible-candidates-for-result")]
        public async Task<IActionResult> GetEligibleCandidatesForResult()
        {
            var candidates = await _context.Candidates
                .Where(c => _context.Interviews.Any(i =>
                    i.CandidateId == c.CandidateId &&
                    i.Result == "Accepted"))
                .Select(c => new
                {
                    c.CandidateId,
                    c.Name,
                    c.Email,
                    c.SkillSet,
                    c.TotalYearsOfExperience,
                    c.Position,
                    c.Salary
                })
                .ToListAsync();

            if (!candidates.Any())
                return Ok(new { message = "No candidates found" });

            return Ok(candidates);
        }


        //offer letter


        [HttpPost("generate-offer-letter")]
        public async Task<IActionResult> GenerateOfferLetter([FromBody] OfferLetterDto dto)
        {
            var interview = await _context.Interviews
                .FirstOrDefaultAsync(i =>
                    i.CandidateId == dto.CandidateId &&
                    i.Result.Trim().ToLower() == "accepted"); // ✅ Case-insensitive

            if (interview == null)
                return BadRequest(new { message ="Offer letter can only be generated for candidates who are accepted."});

            QuestPDF.Settings.License = LicenseType.Community;

            var generator = new OfferLetterGenerator();
            var pdfBytes = generator.GenerateOfferLetter(dto.CandidateName, dto.Position, dto.Salary);

            string fileName = $"{dto.CandidateId}.pdf";

            var candidate = await _context.Candidates.FindAsync(dto.CandidateId);
            if (candidate != null)
            {
                candidate.OfferGenerated = true;
                candidate.Position = dto.Position;
                candidate.Salary = dto.Salary;
                await _context.SaveChangesAsync();
            }

            return File(pdfBytes, "application/pdf", fileName);
        }


        // 8. Candidates rejected after interview

        [HttpGet("records/rejected-candidates")]
        public async Task<IActionResult> GetRejectedCandidates()
        {
            var check = CheckSecondLogin();
            if (check != null) return check;

            var data = await _context.Interviews
                .Include(i => i.Candidate)
                .Where(i => i.Result == "Rejected")
                .ToListAsync();

            var count = data.Count;

            return Ok(new
            {
                NoOfRejectedCandidates = count,
                Candidates = data
            });
        }


        // 9. Candidates who rejected offer letters
        [HttpGet("records/offer-rejected")]
        public async Task<IActionResult> GetOfferRejected()
        {
            var check = CheckSecondLogin();
            if (check != null) return check;

            var data = await _context.Interviews
                .Include(i => i.Candidate)
                .Where(i => i.Status == "OfferRejected")
                .ToListAsync();

            var count = data.Count;

            return Ok(new
            {
                Count = count,
                Candidates = data
            });
        }



        // 12. Search Interview results with status = "Success"
        [HttpGet("search/selected-candidates")]
        public async Task<IActionResult> GetSuccessResults()
        {
            var check = CheckSecondLogin();
            if (check != null) return check;

            var data = await _context.Interviews
                .Include(i => i.Interviewer)
                .Include(i => i.Candidate)
                .Where(i => i.Result == "Accepted") // ✅ Use Result instead of Status
                .ToListAsync();

            var count = data.Count;

            return Ok(new
            {
                NoOfSelectedCandidates = count,
                Candidates = data
            });
        }

        // 13. Search Interviewers by skill set and interview type
        [HttpPost("search/interviewers")]
        public async Task<IActionResult> SearchInterviewers([FromBody] SkillSearchDto dto)
        {
            var check = CheckSecondLogin();
            if (check != null) return check;

            if (string.IsNullOrWhiteSpace(dto.Skill))
                return BadRequest("Skill is required.");

            var skillLower = dto.Skill.ToLower();

            var data = await _context.Interviewers
                .Where(i => i.SkillSet != null && i.SkillSet.ToLower().Contains(skillLower))
                .Select(i => new
                {
                    InterviewerId = i.Id,
                    Name = i.Name,
                    Level = i.Level,
                    SkillSet = i.SkillSet
                })
                .ToListAsync();

            return Ok(data);
        }


        // 15. Candidate feedbacks
        [HttpGet("check-all-feedbacks")]
        public async Task<IActionResult> GetAllCandidateFeedbacks()
        {
            var check = CheckSecondLogin();
            if (check != null) return check;

            var feedbacks = await _context.Feedbacks
                .Include(f => f.Candidate)
                .Include(f => f.Interviewer)
                .Include(f => f.Interview)
                .Select(f => new
                {
                    CandidateId = f.CandidateId,
                    CandidateName = f.Candidate != null ? f.Candidate.Name : null,
                    InterviewerId = f.InterviewerId,
                    InterviewerName = f.Interviewer != null ? f.Interviewer.Name : null,
                    InterviewId = f.InterviewId,
                    Rating = f.Rating,
                    FeedbackText = f.Comments,
                    SubmittedAt = f.SubmittedAt
                })
                .ToListAsync();

            if (!feedbacks.Any())
                return NotFound("No feedbacks found.");

            return Ok(feedbacks);
        }


        // 16. Forward feedback to interviewer
        [HttpPost("forward-feedback")]
        public async Task<IActionResult> ForwardFeedback([FromBody] ForwardFeedbackDto dto)
        {
            var check = CheckSecondLogin();
            if (check != null) return check;

            // Fetch all feedbacks for given interviewer
            var feedbacks = await _context.Feedbacks
                .Where(f => f.InterviewerId == dto.InterviewerId)
                .Select(f => new
                {
                    InterviewId = f.InterviewId,
                    Rating = f.Rating,
                    FeedbackText = f.Comments,
                    SubmittedAt = f.SubmittedAt
                })
                .ToListAsync();

            if (!feedbacks.Any())
                return NotFound("No feedback found for this interviewer.");

            return Ok(new
            {
                InterviewerId = dto.InterviewerId,
                TotalFeedbacks = feedbacks.Count,
                FeedbackDetails = feedbacks
            });
        }
    }
}

