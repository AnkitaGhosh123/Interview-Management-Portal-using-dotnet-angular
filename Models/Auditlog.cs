using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InterviewApi.Models
{
    public class AuditLog
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public int PerformedByUserId { get; set; } // FK to User table
        public User? PerformedByUser { get; set; }  // Navigation property

        [MaxLength(100)]
        public string? PerformedBy { get; set; } // Name or email for readability

        [Required, MaxLength(100)]
        public string Action { get; set; }

        [MaxLength(500)]
        public string? Details { get; set; }

        public string? ResourceId { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}