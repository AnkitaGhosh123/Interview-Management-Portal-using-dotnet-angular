using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InterviewApi.Models
{
    public class Candidate
    {
        [Key]
        public int CandidateId { get; set; }

        [Required]
        public string? Name { get; set; }

        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }          // Link to User table

        public User? User { get; set; }           // Navigation property

        // Interviewer assignment (can be null if not assigned)
        [ForeignKey("Interviewer")]
        public int? AssignedInterviewerId { get; set; }
        public Interviewer? AssignedInterviewer { get; set; }

        // [Required]
        [MaxLength(100)]
        public string? SkillSet { get; set; }     // e.g., "Java", "Angular", "Python"

        [MaxLength(20)]
        public string InterviewStatus { get; set; } = "NotAssigned";
        // Possible values:
        // "NotAssigned", "Assigned", "Interviewed", "Selected", "Rejected", "OfferRejected"

        [MaxLength(255)]
        public string? ResumePath { get; set; }   // Optional: path or URL to resume file

        [MaxLength(50)]
        public string? PreferredInterviewType { get; set; } // e.g., "Technical", "HR", "Managerial"

        public string? Email { get; set; } // Candidate email property
        [MaxLength(100)]
        public string? Position { get; set; }  // e.g., "Software Engineer"

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Salary { get; set; }   // e.g., 50000.00

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime InterviewCompletedAt { get; set; } = DateTime.MinValue;

        // Navigation property for feedbacks
        public ICollection<Feedback>? Feedbacks { get; set; }
        public required string TotalYearsOfExperience { get; set; }


        public string? RecentEducation { get; set; }
        public string? UniversityName { get; set; }
        public string? AverageCGPA { get; set; }
        public string? Projects { get; set; }       // Store as comma-separated string
        public string? Internships { get; set; }    // Store as comma-separated string

        public bool OfferGenerated { get; set; } = false;
    }
}