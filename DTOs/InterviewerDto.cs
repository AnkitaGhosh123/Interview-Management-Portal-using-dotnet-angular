using System;
using System.ComponentModel.DataAnnotations;
 
namespace InterviewApi.DTOs
{
    public class InterviewerDto
    {
        public int Id { get; set; }
 
        [Required]
        [MaxLength(100)]
        public string? FullName { get; set; }
 
        [Required]
        [MaxLength(100)]
        public string? Email { get; set; }
 
        [Required]
        [MaxLength(100)]
        public string? SkillSet { get; set; }  // e.g., "C#", "React", "Python"
 
        [Required]
        [MaxLength(10)]
        public string? Level { get; set; }  // e.g., "L1", "L2"
 
        [Range(0, 40)]
        public int YearsOfExperience { get; set; }
 
        [MaxLength(50)]
        public string? InterviewType { get; set; }  // e.g., "Technical", "HR"
 
        public bool? IsAvailable { get; set; }

        public DateTime? JoinedAt { get; set; } = DateTime.UtcNow;
        
        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string? Password { get; set; }
    }
}
 