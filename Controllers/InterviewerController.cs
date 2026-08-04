using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InterviewApi.Models;
using InterviewApi.DTOs;
using InterviewApi.Utils;
using InterviewApi.Services;
using InterviewApi.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace InterviewApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InterviewerController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public InterviewerController(ApplicationDbContext context, IEmailService emailService, IConfiguration configuration)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
        }

        // ======================
        // 1️⃣ Register/Login
        // ======================

        [AllowAnonymous]

        [HttpPost("register-interviewer")]
        public async Task<IActionResult> RegisterInterviewer([FromBody] InterviewerRegisterDto dto)
        {
            var hashedPassword = PasswordHasher.HashPassword(dto.Password);

            var request = new InterviewerRegistrationRequest
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = hashedPassword,
                SkillSet = dto.SkillSet,
                Level = dto.Level,
                YearsOfExperience = dto.YearsOfExperience,
                InterviewType = dto.InterviewType,
                IsAvailable = dto.IsAvailable
            };

            _context.InterviewerRegistrationRequests.Add(request);
            await _context.SaveChangesAsync();

            var superAdminEmail = await _context.Users
                .Where(u => u.Role == "SuperAdmin")
                .Select(u => u.Email)
                .FirstOrDefaultAsync();

            string body = $@"
        <p>New Interviewer Registration Request:</p>
        <p>Name: {dto.FullName}<br/>
        Email: {dto.Email}<br/>
        SkillSet: {dto.SkillSet}<br/>
        Level: {dto.Level}<br/>
        Experience: {dto.YearsOfExperience} years<br/>
        InterviewType: {dto.InterviewType}</p>";

            await _emailService.SendEmailAsync(superAdminEmail, "Interviewer Registration Request", body);

            return Ok(new { message = "Registration request submitted. Status: Pending" });
        }

        [AllowAnonymous]
        [HttpPost("login-interviewer")]
        public async Task<IActionResult> LoginInterviewer([FromBody] LoginDto dto)
        {
            // Check if registration request exists
            var registrationRequest = await _context.InterviewerRegistrationRequests
                .FirstOrDefaultAsync(r => r.Email == dto.Email);

            if (registrationRequest != null)
            {
                if (registrationRequest.Status == "Rejected")
                    return Unauthorized("Sorry! Registration request is rejected by SuperAdmin.");

                if (registrationRequest.Status == "Pending")
                    return Ok(new { status = "pendingApproval" }); // ✅ New status
            }

            // Check if user exists in Users table
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return Ok(new { status = "newInterviewer" });

            // Validate password
            if (!PasswordHasher.VerifyPassword(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid email or password.");

            if (user.Role != "Interviewer")
                return Unauthorized("You are not authorized to login as Interviewer.");

            // Generate JWT token
            var token = JwtTokenGenerator.GenerateToken(user, _configuration, false);

            // Fetch Interviewer details
            var interviewer = await _context.Interviewers.FirstOrDefaultAsync(i => i.UserId == user.UserId);

            if (interviewer == null)
                return NotFound(new { message = "Interviewer record not found." });

            return Ok(new
            {
                token,
                interviewerId = interviewer.Id,
                user = new
                {
                    user.UserId,
                    user.Email,
                    user.FullName,
                    user.Role,
                    interviewer.SkillSet,
                    interviewer.Level,
                    interviewer.YearsOfExperience,
                    interviewer.InterviewType
                }
            });
        }



        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var interviewer = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Role == "Interviewer");

            if (interviewer == null)
                return NotFound(new { message = "No interviewer found with this email." });

            // Hash new password
            interviewer.PasswordHash = PasswordHasher.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password reset successful." });
        }


        [Authorize(Roles = "Interviewer")]
        [HttpGet("candidate/{candidateId}/resume")]
        public async Task<IActionResult> DownloadCandidateResume(int candidateId)
        {
            var candidate = await _context.Candidates.FindAsync(candidateId);
            if (candidate == null || string.IsNullOrEmpty(candidate.ResumePath) || !System.IO.File.Exists(candidate.ResumePath))
                return NotFound("Resume not found.");

            var fileBytes = await System.IO.File.ReadAllBytesAsync(candidate.ResumePath);
            var fileName = Path.GetFileName(candidate.ResumePath);
            var contentType = "application/octet-stream";

            return File(fileBytes, contentType, fileName);
        }





        // ======================
        // 2️⃣ View Assigned Candidates
        // ======================

        [Authorize(Roles = "Interviewer")]
        [HttpGet("assigned-candidates/{interviewerId}")]
        public async Task<IActionResult> GetAssignedCandidates(int interviewerId)
        {
            var candidates = await _context.Candidates
                .Where(c => c.AssignedInterviewerId == interviewerId
                            && c.InterviewStatus != "Interview Completed") // ✅ Filter added
                .Include(c => c.AssignedInterviewer)
                .Select(c => new
                {
                    CandidateId = c.CandidateId,
                    Name = c.Name,
                    SkillSet = c.SkillSet,
                    InterviewStatus = c.InterviewStatus,
                    ResumePath = c.ResumePath,
                    Email = c.Email,
                    CreatedAt = c.CreatedAt,
                    InterviewCompletedAt = c.InterviewCompletedAt,
                    TotalYearsOfExperience = c.TotalYearsOfExperience,
                    AssignedInterviewerName = c.AssignedInterviewer != null ? c.AssignedInterviewer.Name : null,
                    ResumeUrl = $"{Request.Scheme}://{Request.Host}/Resumes/{Path.GetFileName(c.ResumePath)}"
                })
                .ToListAsync();

            if (!candidates.Any())
            {
                return Ok(new
                {
                    Candidates = new List<object>(),
                    Message = "No candidate is assigned to you till now"
                });
            }

            return Ok(new
            {
                Candidates = candidates,
                Message = ""
            });
        }




        // ======================
        // 3️⃣ Reject Conducting an Interview
        // ======================

        [Authorize(Roles = "Interviewer")]
        [HttpPut("reschedule-interview/{candidateId}")]
        public async Task<IActionResult> RescheduleInterview(int candidateId, [FromBody] DateTime newDate)
        {
            var candidate = await _context.Candidates.Include(c => c.User)
                .FirstOrDefaultAsync(c => c.CandidateId == candidateId);

            if (candidate == null)
                return NotFound("Candidate not found.");

            var interview = await _context.Interviews
                .FirstOrDefaultAsync(i => i.CandidateId == candidateId);

            if (interview == null)
                return NotFound("Interview not found.");

            interview.Status = "Rescheduled";
            interview.ScheduledAt = newDate;
            candidate.InterviewStatus = "Interview Rescheduled";

            await _context.SaveChangesAsync();

            // ✅ Send Email
            await _emailService.SendEmailAsync(candidate.Email,

"Interview Rescheduled",
    $@"<p>Dear {candidate.Name},</p>
       <p>Your interview has been <strong>rescheduled</strong> to <b>{newDate:dd MMM yyyy hh:mm tt}</b>.</p>
       <p>Location: Office.</p>
       <p>Sorry for the inconvenience.</p>
       <p>Regards,<br/>Interview Team</p>"
            );

            return Ok(new { message = "Interview rescheduled successfully" });
        }


        // ======================
        // 4️⃣ Accept/Reject Candidate After Interview (with email)
        // ======================
        [Authorize(Roles = "Interviewer")]
        [HttpPut("decision/{candidateId}")]
        public async Task<IActionResult> GiveDecision(int candidateId, [FromBody] InterviewResultDto dto)
        {
            if (candidateId <= 0) return BadRequest("Invalid candidate ID.");
            if (dto == null) return BadRequest("Request body cannot be empty.");

            string finalStatus = dto.IsAccepted.HasValue
                ? (dto.IsAccepted.Value ? "Accepted" : "Rejected")
                : dto.ResultStatus?.Trim();

            if (finalStatus != "Accepted" && finalStatus != "Rejected")
                return BadRequest("ResultStatus must be either 'Accepted' or 'Rejected'.");

            var candidate = await _context.Candidates.Include(c => c.User)
                .FirstOrDefaultAsync(c => c.CandidateId == candidateId);

            if (candidate == null) return NotFound("Candidate not found.");

            var interview = await _context.Interviews
            .FirstOrDefaultAsync(i => i.CandidateId == candidateId);

            if (interview == null)
                return NotFound("Interview not found for this candidate.");

            //candidate.InterviewStatus = finalStatus;
            interview.Result = finalStatus; // ✅ Correct

            await _context.SaveChangesAsync();

            return Ok(new { message = $"Candidate marked as {finalStatus}" });
        }



        [Authorize(Roles = "Interviewer")]
        [HttpGet("completed-candidates/{interviewerId}")]
        public async Task<IActionResult> GetCompletedCandidates(int interviewerId)
        {
            var candidates = await _context.Candidates
                .Where(c => c.AssignedInterviewerId == interviewerId
                            && c.InterviewStatus == "Interview Completed")
                .Join(_context.Interviews,
                      c => c.CandidateId,
                      i => i.CandidateId,
                      (c, i) => new { Candidate = c, Interview = i })
                .Where(x => x.Interview.Result == "NotEvaluated") // ✅ Only pending decisions
                .Select(x => new
                {
                    CandidateId = x.Candidate.CandidateId,
                    Name = x.Candidate.Name,
                    Email = x.Candidate.Email,
                    SkillSet = x.Candidate.SkillSet,
                    TotalYearsOfExperience = x.Candidate.TotalYearsOfExperience
                })
                .ToListAsync();

            if (!candidates.Any())
                return Ok(new { Candidates = new List<object>(), Message = "No candidates pending decision" });

            return Ok(new { Candidates = candidates, Message = "" });
        }


        // ======================
        // 5️⃣ Mark Interview Completed
        // ======================

        [Authorize(Roles = "Interviewer")]
        [HttpPut("complete-interviews")]
        public async Task<IActionResult> MarkMultipleInterviewsComplete([FromBody] int[] candidateIds)
        {
            var candidates = await _context.Candidates
                .Where(c => candidateIds.Contains(c.CandidateId))
                .ToListAsync();

            if (!candidates.Any()) return NotFound("No candidates found.");

            foreach (var candidate in candidates)
            {
                candidate.InterviewStatus = "Interview Completed";
                candidate.InterviewCompletedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Selected interviews marked as completed." });
        }


        //get profile 
        [Authorize(Roles = "Interviewer")]
        [HttpGet("profile/{interviewerId}")]
        public async Task<IActionResult> GetProfile(int interviewerId)
        {
            var interviewer = await _context.Interviewers
                .Include(i => i.User)
                .FirstOrDefaultAsync(i => i.Id == interviewerId);

            if (interviewer == null)
                return NotFound("Interviewer not found.");

            var dto = new InterviewerDto
            {
                Id = interviewer.Id,
                FullName = interviewer.User?.FullName,
                Email = interviewer.User?.Email,
                SkillSet = interviewer.SkillSet,
                Level = interviewer.Level,
                YearsOfExperience = interviewer.YearsOfExperience,
                InterviewType = interviewer.InterviewType,
                IsAvailable = interviewer.IsAvailable,
                JoinedAt = interviewer.CreatedAt,
                // Password field blank রাখুন (security)
            };

            return Ok(dto);
        }
        // ======================
        // 6️⃣ Update Profile
        // ======================
        [Authorize(Roles = "Interviewer")]
        [HttpPut("update-profile/{interviewerId}")]
        public async Task<IActionResult> UpdateProfile(int interviewerId, [FromBody] InterviewerDto dto)
        {
            var interviewer = await _context.Interviewers
                .Include(i => i.User)
                .FirstOrDefaultAsync(i => i.Id == interviewerId);

            if (interviewer == null)
                return NotFound("Interviewer not found.");

            if (interviewer.User != null)
            {
                if (!string.IsNullOrWhiteSpace(dto.Email))
                    interviewer.User.Email = dto.Email;
                if (!string.IsNullOrWhiteSpace(dto.FullName))
                    interviewer.User.FullName = dto.FullName;
                if (!string.IsNullOrWhiteSpace(dto.Password))
                    interviewer.User.PasswordHash = PasswordHasher.HashPassword(dto.Password);
                interviewer.User.Role = "Interviewer";
            }


            if (!string.IsNullOrWhiteSpace(dto.FullName))
                interviewer.Name = dto.FullName;

            if (!string.IsNullOrWhiteSpace(dto.Email))
                interviewer.Email = dto.Email;

            if (!string.IsNullOrWhiteSpace(dto.Password))
                interviewer.PasswordHash = PasswordHasher.HashPassword(dto.Password);

            if (!string.IsNullOrWhiteSpace(dto.SkillSet))
                interviewer.SkillSet = dto.SkillSet;

            // YearsOfExperience: always update if in valid range
            if (dto.YearsOfExperience >= 0 && dto.YearsOfExperience <= 40)
                interviewer.YearsOfExperience = dto.YearsOfExperience;

            if (!string.IsNullOrWhiteSpace(dto.Level))
                interviewer.Level = dto.Level;
            if (!string.IsNullOrWhiteSpace(dto.InterviewType))
                interviewer.InterviewType = dto.InterviewType;
            if (dto.IsAvailable.HasValue)
                interviewer.IsAvailable = dto.IsAvailable.Value;
            if (dto.JoinedAt != default)
                interviewer.CreatedAt = dto.JoinedAt;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Profile updated successfully." });

        }


        [HttpGet("see-all-feedback")]
        public async Task<IActionResult> GetFeedbackForInterviewer([FromQuery] int interviewerId)
        {
            if (interviewerId <= 0)
                return BadRequest("Invalid interviewer ID.");

            var feedbacks = await _context.Feedbacks
                .Where(f => f.InterviewerId == interviewerId)
                .Select(f => new
                {
                    Rating = f.Rating,
                    Comments = f.Comments,
                    SubmittedAt = f.SubmittedAt
                })
                .ToListAsync();

            if (!feedbacks.Any())
            {
                return Ok(new
                {
                    InterviewerId = interviewerId,
                    TotalFeedbacks = 0,
                    FeedbackDetails = new List<object>(),
                    Message = "No feedbacks found for you till now"
                });
            }

            return Ok(new
            {
                InterviewerId = interviewerId,
                TotalFeedbacks = feedbacks.Count,
                FeedbackDetails = feedbacks,
                Message = ""
            });
        }
    }
}