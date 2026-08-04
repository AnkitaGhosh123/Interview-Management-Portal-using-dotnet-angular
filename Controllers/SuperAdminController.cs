
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InterviewApi.Data;
using InterviewApi.Models;
using InterviewApi.DTOs;
using InterviewApi.Services;
using InterviewApi.Utils;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class SuperAdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;

    public SuperAdminController(ApplicationDbContext context, IConfiguration configuration, IEmailService emailService)
    {
        _context = context;
        _configuration = configuration;
        _emailService = emailService;
    }

    // ✅ Register SuperAdmin
    [HttpPost("register-superadmin")]
    public IActionResult RegisterSuperAdmin([FromBody] SuperAdminRegisterDto dto)
    {
        string hashedPassword = PasswordHasher.HashPassword(dto.Password);

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = hashedPassword,
            Role = "SuperAdmin",
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok("SuperAdmin registered successfully!");
    }

    // ✅ Login SuperAdmin
    [HttpPost("login-superadmin")]
    public async Task<IActionResult> LoginSuperAdmin([FromBody] LoginDto dto)
    {
        var superAdminUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Role == "SuperAdmin");

        if (superAdminUser == null)
            return Unauthorized(new { message = "Unauthorized! You are not the SuperAdmin" });

        if (!PasswordHasher.VerifyPassword(dto.Password, superAdminUser.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password" });

        var token = JwtTokenGenerator.GenerateToken(superAdminUser, _configuration);

        return Ok(new
        {
            status = "success",
            token,
            user = new
            {
                superAdminUser.UserId,
                superAdminUser.Email,
                superAdminUser.FullName,
                superAdminUser.Role
            }
        });
    }

    // ✅ Pending Requests
    //[Authorize(Roles = "SuperAdmin")]
    [HttpGet("admin-requests")]
    public async Task<IActionResult> GetAdminRequests()
    {
        var requests = await _context.AdminRegistrationRequests
            .Where(r => r.Status == "Pending")
            .ToListAsync();
        return Ok(requests);
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpGet("interviewer-requests")]
    public async Task<IActionResult> GetInterviewerRequests()
    {
        var requests = await _context.InterviewerRegistrationRequests
            .Where(r => r.Status == "Pending")
            .ToListAsync();
        return Ok(requests);
    }

    //[Authorize(Roles = "SuperAdmin")]
    [HttpGet("pending-count")]
    public async Task<IActionResult> GetPendingCount()
    {
        var adminPending = await _context.AdminRegistrationRequests.CountAsync(r => r.Status == "Pending");
        var interviewerPending = await _context.InterviewerRegistrationRequests.CountAsync(r => r.Status == "Pending");

        return Ok(new { totalPending = adminPending + interviewerPending });
    }

    // ✅ Approved & Rejected Lists
    [HttpGet("admin-requests-approved")]
    public async Task<IActionResult> GetAdminRequestsApproved()
    {
        var requests = await _context.AdminRegistrationRequests
            .Where(r => r.Status == "Approved")
            .ToListAsync();
        return Ok(requests);
    }

    [HttpGet("admin-requests-rejected")]
    public async Task<IActionResult> GetAdminRequestsRejected()
    {
        var requests = await _context.AdminRegistrationRequests
            .Where(r => r.Status == "Rejected")
            .ToListAsync();
        return Ok(requests);
    }

    [HttpGet("interviewer-requests-approved")]
    public async Task<IActionResult> GetInterviewerRequestsApproved()
    {
        var requests = await _context.InterviewerRegistrationRequests
            .Where(r => r.Status == "Approved")
            .ToListAsync();
        return Ok(requests);
    }

    [HttpGet("interviewer-requests-rejected")]
    public async Task<IActionResult> GetInterviewerRequestsRejected()
    {
        var requests = await _context.InterviewerRegistrationRequests
            .Where(r => r.Status == "Rejected")
            .ToListAsync();
        return Ok(requests);
    }

    // ✅ Approve Admin
    [HttpPost("approve-admin")]
    public async Task<IActionResult> ApproveAdmin([FromBody] EmailDto model)
    {
        var email = model.Email;
        var request = await _context.AdminRegistrationRequests
            .FirstOrDefaultAsync(r => r.Email == email && r.Status == "Pending");

        if (request == null)
            return NotFound(new { message = "No pending request found for this email." });

        // Check if user already exists
        if (await _context.Users.AnyAsync(u => u.Email == email))
            return BadRequest(new { message = "User with this email already exists." });

        request.Status = "Approved";

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = request.PasswordHash,
            Role = "Admin"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        await _emailService.SendEmailAsync(email,
            "Registration Approved",
            "Your registration request is successfully approved by SuperAdmin. Now you can login to your dashboard.");

        return Ok(new { message = "Admin approved and registered." });
    }

    // ✅ Reject Admin
    [HttpPost("reject-admin")]
    public async Task<IActionResult> RejectAdmin([FromBody] EmailDto model)
    {
        var email = model.Email;
        var request = await _context.AdminRegistrationRequests
            .FirstOrDefaultAsync(r => r.Email == email && r.Status == "Pending");

        if (request == null)
            return NotFound(new { message = "No pending request found for this email." });

        request.Status = "Rejected";
        await _context.SaveChangesAsync();

        await _emailService.SendEmailAsync(email,
            "Registration Rejected",
            "Your registration request was rejected by SuperAdmin.");

        return Ok(new { message = "Admin registration rejected." });
    }

    // ✅ Approve Interviewer
    [HttpPost("approve-interviewer")]
    public async Task<IActionResult> ApproveInterviewer([FromBody] EmailDto model)
    {
        var email = model.Email;
        var request = await _context.InterviewerRegistrationRequests
            .FirstOrDefaultAsync(r => r.Email == email && r.Status == "Pending");

        if (request == null)
            return NotFound(new { message = "No pending request found for this email." });

        // Check if user already exists
        if (await _context.Users.AnyAsync(u => u.Email == email))
            return BadRequest(new { message = "User with this email already exists." });

        request.Status = "Approved";

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = request.PasswordHash,
            Role = "Interviewer"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var interviewer = new Interviewer
        {
            Name = request.FullName,
            Email = request.Email,
            UserId = user.UserId,
            SkillSet = request.SkillSet,
            Level = request.Level,
            YearsOfExperience = request.YearsOfExperience,
            InterviewType = request.InterviewType,
            IsAvailable = request.IsAvailable
        };

        _context.Interviewers.Add(interviewer);
        await _context.SaveChangesAsync();

        await _emailService.SendEmailAsync(email,
            "Registration Approved",
            "Your registration request is approved. You can now login as Interviewer.");

        return Ok(new { message = "Interviewer approved and registered." });
    }

    // ✅ Reject Interviewer
    [HttpPost("reject-interviewer")]
    public async Task<IActionResult> RejectInterviewer([FromBody] EmailDto model)
    {
        var email = model.Email;
        var request = await _context.InterviewerRegistrationRequests
            .FirstOrDefaultAsync(r => r.Email == email && r.Status == "Pending");

        if (request == null)
            return NotFound(new { message = "No pending request found for this email." });

        request.Status = "Rejected";
        await _context.SaveChangesAsync();

        await _emailService.SendEmailAsync(email,
            "Registration Rejected",
            "Your registration request was rejected by SuperAdmin.");

        return Ok(new { message = "Interviewer registration rejected." });
    }
}
