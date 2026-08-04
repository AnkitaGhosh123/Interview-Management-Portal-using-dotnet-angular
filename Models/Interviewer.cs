using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InterviewApi.Models
{
    public class Interviewer
    {
        [Key]
        public int Id { get; set; }

        public string? Name { get; set; }
        public string? Email { get; set; }

        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }           // Link to User table

        public User? User { get; set; }           // Navigation property

        [Required]
        [MaxLength(100)]
        public string? SkillSet { get; set; }      // e.g., "Java, Angular, SQL"

        [Required]
        [MaxLength(10)]
        public string? Level { get; set; }         // e.g., "L1" or "L2"

        [Required]
        public int YearsOfExperience { get; set; }

        public bool? IsAvailable { get; set; }   // Can take interviews or not

        public int MaxCandidates { get; set; } = 5;     // Admin can set limit per interviewer

        [Required]
        [MaxLength(50)]
        public string? InterviewType { get; set; }

        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

        public string? PasswordHash { get; set; }

        // Navigation property for feedbacks
        public ICollection<Feedback>? Feedbacks { get; set; }

        // Navigation property for interviews (optional, future use)
        public ICollection<Interview>? Interviews { get; set; }
    }
}
