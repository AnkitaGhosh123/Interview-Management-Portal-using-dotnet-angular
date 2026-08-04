using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using InterviewApi.Services;
using InterviewApi.Data;
using InterviewApi.DTOs;
using InterviewApi.Models;
using InterviewApi.Utils;
 
namespace InterviewApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration; 
        private readonly ApplicationDbContext _context;
 
        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
 
        // ✅ Register a new user
        public async Task<string> RegisterAsync(RegisterDto registerDto)
        {
            // Check duplicate email
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == registerDto.Email);
            if (existingUser != null)
                return "Email already registered.";
 
            // Create new user
            var user = new User
            {
                Email = registerDto.Email,
                PasswordHash = PasswordHasher.HashPassword(registerDto.Password),
                Role = registerDto.Role,
                FullName = registerDto.FullName
            };
 
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
 
            // Log registration
            var log = new AuditLog
            {
                Action = $"User registered: {user.Email} ({user.Role})",
                PerformedBy = user.Email,
                Timestamp = DateTime.Now
            };
 
            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
 
            return "Registration successful!";
        }
 
        // ✅ Login user and return JWT token + user details
        public async Task<(string token, User user)> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null)
                throw new Exception("Invalid email or password.");
 
            if (!PasswordHasher.VerifyPassword(loginDto.Password, user.PasswordHash))
                throw new Exception("Invalid email or password.");
 
            // Generate JWT token
            var token = JwtTokenGenerator.GenerateToken(user, _configuration);
 
            // Log login
            var log = new AuditLog
            {
                Action = $"User logged in: {user.Email} ({user.Role})",
                PerformedBy = user.Email,
                Timestamp = DateTime.Now
            };
 
            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
 
            return (token, user);
        }
    }
}
 