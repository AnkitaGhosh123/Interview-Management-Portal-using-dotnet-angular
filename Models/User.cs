using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace InterviewApi.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        public string? PasswordHash { get; set; }   // Store hashed password only

        [Required]
        [MaxLength(50)]
        public string? FullName { get; set; }

        [Required]
        [MaxLength(20)]
        public string? Role { get; set; }           // "Admin", "Interviewer", "Candidate"

        public string? SecretKeyHash { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true; // For soft-disable users if needed

        // Navigation property for Interviewer (if applicable)
        public Interviewer? Interviewer { get; set; }

        // Navigation property for Candidate (if applicable)
        public Candidate? Candidate { get; set; }

        // Navigation property for AuditLogs (if applicable)
        public ICollection<AuditLog>? AuditLogs { get; set; }
    }
}