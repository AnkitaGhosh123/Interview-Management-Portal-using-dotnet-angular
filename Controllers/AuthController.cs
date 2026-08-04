using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InterviewApi.DTOs;
using InterviewApi.Data;
using InterviewApi.Models;
using InterviewApi.Utils;
using InterviewApi.Services;
using System;
using System.Linq;
using System.Threading.Tasks;
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;

    public AuthController(ApplicationDbContext context, IConfiguration configuration, IEmailService emailService)
    {
        _context = context;
        _configuration = configuration;
        _emailService = emailService;
    }


    [AllowAnonymous]

    [HttpPost("register-admin")]
    public async Task<IActionResult> RegisterAdmin([FromBody] RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest("Email already exists.");

        if (dto.Role != "Admin")
            return BadRequest("Invalid role for this endpoint.");

        var hashedPassword = PasswordHasher.HashPassword(dto.Password);

        // Save request in DB
        var request = new AdminRegistrationRequest
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = hashedPassword,
            Status = "Pending"
        };

        _context.AdminRegistrationRequests.Add(request);
        await _context.SaveChangesAsync();

        // Fetch SuperAdmin email
        var superAdminEmail = await _context.Users
            .Where(u => u.Role == "SuperAdmin")
            .Select(u => u.Email)
            .FirstOrDefaultAsync();

        if (superAdminEmail == null)
            return StatusCode(500, "SuperAdmin email not found.");

        // Email body
        string body = $@"
        <div style='font-family:Segoe UI,Arial;font-size:15px;color:#222;'>
            <p>Dear SuperAdmin,</p>
            <p>
                A new user wants to register as <b>Admin</b>.<br/>
                <b>Name:</b> {dto.FullName}<br/>
                <b>Email:</b> {dto.Email}<br/>
                <b>Requested At:</b> {DateTime.UtcNow}
            </p>
            <p>
                Please approve or reject this request from your dashboard.
            </p>
        </div>";

        await _emailService.SendEmailAsync(superAdminEmail, "Admin Registration Request", body);

        return Ok(new { message = "Registration request submitted. Status: Pending" });
    }


    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AdminLoginDto dto)
    {
        // Check registration request
        var registrationRequest = await _context.AdminRegistrationRequests
            .FirstOrDefaultAsync(r => r.Email == dto.Email);

        if (registrationRequest != null)
        {
            if (registrationRequest.Status == "Rejected")
                return Unauthorized("Sorry! Registration request is rejected by SuperAdmin.");

            if (registrationRequest.Status == "Pending")
                return Ok(new { status = "pendingApproval" }); // ✅ New status
        }

        // Check if user exists
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
            return Ok(new { status = "newAdmin" }); // ✅ New status for unregistered admin

        // Validate password
        if (!PasswordHasher.VerifyPassword(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid email or password.");

        if (user.Role != "Admin" && user.Role != "SuperAdmin")
            return Unauthorized("You are not authorized to login as Admin.");

        // Secret key logic for Admin
        if (user.Role == "Admin")
        {
            if (string.IsNullOrEmpty(user.SecretKeyHash))
            {
                user.SecretKeyHash = PasswordHasher.HashPassword(dto.SecretKey);
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
            }
            else
            {
                if (!PasswordHasher.VerifyPassword(dto.SecretKey, user.SecretKeyHash))
                    return Unauthorized("Invalid secret key.");
            }
        }

        var token = JwtTokenGenerator.GenerateToken(user, _configuration, false);

        return Ok(new
        {
            token,
            user = new { user.UserId, user.Email, user.FullName, user.Role }
        });
    }
}