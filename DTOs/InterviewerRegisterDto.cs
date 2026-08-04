
using System.ComponentModel.DataAnnotations;

namespace InterviewApi.DTOs
{
    public class InterviewerRegisterDto
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
        [MaxLength(100)]
        public string FullName { get; set; }

        [Required]
        [MaxLength(100)]
        public string SkillSet { get; set; } // e.g., "Java, Angular, SQL"

        [Required]
        [MaxLength(10)]
        public string Level { get; set; } // e.g., "L1" or "L2"

        [Required]
        [Range(0, 50, ErrorMessage = "Years of experience must be between 0 and 50.")]
        public int YearsOfExperience { get; set; }

        [Required]
        [MaxLength(50)]
        public string InterviewType { get; set; } // e.g., "Technical", "HR"
        public bool IsAvailable { get; set; } = false;
    }
}
