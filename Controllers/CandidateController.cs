using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using InterviewApi.Data;
using InterviewApi.Models;
using InterviewApi.DTOs;
using InterviewApi.Services;
using InterviewApi.Utils;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace InterviewApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CandidateController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CandidateController(
            ApplicationDbContext context,
            IEmailService emailService,
            IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        // ----------------- Register Candidate -----------------
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CandidateRegisterDto dto)
        {

            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email already exists.");

            var hashedPassword = PasswordHasher.HashPassword(dto.Password);

            var newUser = new User
            {
                Email = dto.Email,
                PasswordHash = hashedPassword,
                Role = "Candidate",
                FullName = dto.FullName
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            // ✅ Generate Resume using QuestPDF
            var resumeService = new ResumeGeneratorService();
            var pdfBytes = resumeService.GenerateResume(dto);

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Resumes");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}.pdf";
            var filePath = Path.Combine(uploadsFolder, fileName);
            await System.IO.File.WriteAllBytesAsync(filePath, pdfBytes);

            var candidate = new Candidate
            {
                Name = dto.FullName,
                UserId = newUser.UserId,
                SkillSet = dto.SkillSet,
                TotalYearsOfExperience = dto.TotalYearsOfExperience,
                Email = dto.Email,
                ResumePath = filePath,
                InterviewStatus = "NotAssigned",
                RecentEducation = dto.RecentEducation,
                UniversityName = dto.UniversityName,
                AverageCGPA = dto.AverageCGPA,
                Projects = dto.Projects != null ? string.Join(", ", dto.Projects) : null,
                Internships = dto.Internships != null ? string.Join(", ", dto.Internships) : null
            };

            _context.Candidates.Add(candidate);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Registration successful.",
                userId = newUser.UserId,
                candidateId = candidate.CandidateId,

                resumeDownloadUrl = $"{Request.Scheme}://{Request.Host}/Resumes/{fileName}"

            });
        }


        // ----------------- Login -----------------
        //[Authorize(Roles = "Candidate")]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // ✅ Find user with Candidate role
            var candidateUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Role == "Candidate");

            if (candidateUser == null)
                return Ok(new { status = "newCandidate" });

            // ✅ Verify password
            if (!PasswordHasher.VerifyPassword(dto.Password, candidateUser.PasswordHash))
                return Ok(new { status = "invalidCredentials" });

            // ✅ Generate JWT token
            var token = JwtTokenGenerator.GenerateToken(candidateUser, _configuration);

            // ✅ Fetch Candidate record linked to this user
            var candidate = await _context.Candidates
                .FirstOrDefaultAsync(c => c.UserId == candidateUser.UserId);

            if (candidate == null)
                return NotFound(new { message = "Candidate record not found." });

            // ✅ Return token + candidateId + user details
            return Ok(new
            {
                status = "success",
                token,
                candidateId = candidate.CandidateId,
                interviewStatus = candidate.InterviewStatus,
                user = new
                {
                    candidateUser.UserId,
                    candidateUser.Email,
                    candidateUser.FullName,
                    candidateUser.Role
                }
            });
        }

        //[Authorize(Roles = "Candidate")]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var candidateUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.Role == "Candidate");
            if (candidateUser == null)
                return NotFound("Email not found.");

            candidateUser.PasswordHash = PasswordHasher.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { messaage = "Password reset successful." });
        }

        // ----------------- Get Interview Status -----------------
        [Authorize(Roles = "Candidate")]
        [HttpGet("{candidateId}/interview-status")]
        public async Task<IActionResult> GetInterviewStatus(int candidateId)
        {
            var candidate = await _context.Candidates.FindAsync(candidateId);
            if (candidate == null) return NotFound("Candidate not found.");

            return Ok(new { name = candidate.Name, interviewStatus = candidate.InterviewStatus });
        }

        [Authorize(Roles = "Candidate")]
        [HttpGet("{candidateId}/feedback-status")]
        public async Task<IActionResult> CheckFeedbackStatus(int candidateId)
        {
            var exists = await _context.Feedbacks.AnyAsync(f => f.CandidateId == candidateId);
            return Ok(new { alreadySubmitted = exists });
        }


        [Authorize(Roles = "Candidate")]
        [HttpPost("{candidateId}/feedback")]
        public async Task<IActionResult> SubmitFeedback(int candidateId, [FromBody] FeedbackDto feedbackDto)
        {
            // Candidate check
            var candidate = await _context.Candidates.FindAsync(candidateId);
            if (candidate == null)
                return NotFound("Candidate not found.");

            // Interview check
            var interview = await _context.Interviews
                .FirstOrDefaultAsync(i => i.Id == feedbackDto.InterviewId && i.CandidateId == candidateId);
            if (interview == null)
                return NotFound("Interview not found for this candidate.");

            // Interviewer check
            var interviewer = await _context.Interviewers.FindAsync(feedbackDto.InterviewerId);
            if (interviewer == null)
                return NotFound("Interviewer not found.");

            // All valid, proceed to save feedback
            var feedback = new Feedback
            {
                CandidateId = candidateId,
                InterviewId = feedbackDto.InterviewId, // ✅ Required foreign key
                InterviewerId = feedbackDto.InterviewerId,
                Comments = feedbackDto.Comments,
                Rating = feedbackDto.Rating,
                SubmittedAt = DateTime.UtcNow
            };

            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Feedback submitted successfully." });
        }


        // ----------------- Get Interview Result -----------------
        [Authorize(Roles = "Candidate")]


[Authorize(Roles = "Candidate")]
[HttpGet("{candidateId}/result")]
public async Task<IActionResult> GetInterviewResult(int candidateId)
{
    var candidate = await _context.Candidates.FindAsync(candidateId);
    if (candidate == null) return NotFound("Candidate not found.");

    var interview = await _context.Interviews
        .Where(i => i.CandidateId == candidateId)
        .OrderByDescending(i => i.ScheduledAt)
        .FirstOrDefaultAsync();

    if (interview == null)
    {
        // No interview assigned
        return Ok(new
        {
            candidateId = candidate.CandidateId,
            name = candidate.Name,
            result = "NotAssigned",
            alreadySubmitted = false
        });
    }

    // Handle null or empty Result
    var resultValue = string.IsNullOrEmpty(interview.Result) ? "NotEvaluated" : interview.Result;
    bool alreadySubmitted = interview.Status == "OfferAccepted" || interview.Status == "OfferRejected";

    return Ok(new
    {
        candidateId = candidate.CandidateId,
        name = candidate.Name,
        result = resultValue,
        alreadySubmitted
    });
}



        [Authorize(Roles = "Candidate")]
        [HttpPost("offer-decision")]
        public async Task<IActionResult> OfferDecision([FromBody] OfferDecisionRequest request)
        {
            // Find interview for this candidate (latest or where result is "Accepted")
            var interview = await _context.Interviews
                .Include(i => i.Candidate)
                .FirstOrDefaultAsync(i => i.CandidateId == request.CandidateId && i.Result == "Accepted");

            if (interview == null)
                return NotFound(new { message = "No offer letter found for this candidate." });

            // Update status based on decision
            if (request.Decision == "Accepted")
            {
                interview.Status = "OfferAccepted";
            }
            else if (request.Decision == "Rejected")
            {
                interview.Status = "OfferRejected";
            }
            else
            {
                return BadRequest(new { message = "Invalid decision. Use 'Accepted' or 'Rejected'." });
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = $"Offer letter {request.Decision.ToLower()} successfully!" });
        }



        [Authorize(Roles = "Candidate")]
        [HttpGet("{candidateId}/assigned-interview")]
        public async Task<IActionResult> GetAssignedInterview(int candidateId)
        {
            var interview = await _context.Interviews
                .Include(i => i.Interviewer)
                .FirstOrDefaultAsync(i => i.CandidateId == candidateId);

            if (interview == null || interview.Interviewer == null)
                return Ok(new { interviewId = (int?)null, interviewerId = (int?)null, interviewerName = "" });

            return Ok(new
            {
                interviewId = interview.Id,
                interviewerId = interview.InterviewerId,
                interviewerName = interview.Interviewer.Name
            });
        }

    }
}
