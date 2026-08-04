using System;
using System.ComponentModel.DataAnnotations;

namespace InterviewApi.DTOs
{
    public class FeedbackDto
    {
        [Required]
        public int CandidateId { get; set; } // Linked to Candidate table

        [Required]
        public int InterviewId { get; set; }
        [Required]
        public int InterviewerId { get; set; }

        [Required]
        [MaxLength(500)]


        public string Comments { get; set; } // Candidate feedback text

        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int Rating { get; set; } // Optional rating from 1–5

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Auto-set time
    }
}