using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InterviewApi.Models
{
    public class Feedback
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CandidateId { get; set; }
        [ForeignKey("CandidateId")]
        public Candidate Candidate { get; set; }

        [Required]
        public int InterviewId { get; set; }
        [ForeignKey("InterviewId")]
        public Interview Interview { get; set; }

        [Required]
        public int InterviewerId { get; set; }
        [ForeignKey("InterviewerId")]
        public Interviewer Interviewer { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(1000)]
        public string Comments { get; set; }

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}
