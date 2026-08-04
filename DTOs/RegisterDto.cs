using System.ComponentModel.DataAnnotations;
 
namespace InterviewApi.DTOs
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
 
        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; }
 
        [Required]
        [Compare("Password", ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; set; }
 
        [Required]
        [RegularExpression("^(Admin|Interviewer|Candidate)$", ErrorMessage = "Role must be Admin, Interviewer, or Candidate")]
        public string Role { get; set; }   // "Admin", "Interviewer", or "Candidate"
 
        [MaxLength(100)]
        public required string FullName { get; set; } // Optional field for user’s full name
    }
}
 