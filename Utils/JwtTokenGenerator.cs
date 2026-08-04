using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using InterviewApi.Models;
using Microsoft.Extensions.Configuration;

namespace InterviewApi.Utils
{
    public class JwtTokenGenerator
    {
        // Generate JWT token for a user
        public static string GenerateToken(User user, IConfiguration configuration, bool isSecondLogin = false)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(configuration["Jwt:Key"]);
            var claims = new List<Claim>
    {
        new Claim("UserId", user.UserId.ToString()),
        new Claim(JwtRegisteredClaimNames.Sub, user.Email),
        new Claim(ClaimTypes.Role, user.Role),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

            // Admin হলে custom claim যোগ করো
            if (user.Role == "Admin")
                claims.Add(new Claim("AdminSecondLogin", isSecondLogin ? "true" : "false"));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(2),
                Issuer = "InterviewApi",
                Audience = "InterviewApiUsers",
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        // Validate a JWT token (returns ClaimsPrincipal or null)
        public static ClaimsPrincipal ValidateToken(string token, IConfiguration configuration)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(configuration["Jwt:Key"]);

            try
            {
                var parameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = "InterviewApi",
                    ValidAudience = "InterviewApiUsers",
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };

                var principal = tokenHandler.ValidateToken(token, parameters, out _);
                return principal;
            }
            catch (Exception ex)
            {
                // ✅ Log exception in production
                Console.WriteLine($"Token validation failed: {ex.Message}");
                return null;
            }
        }
    }
}
