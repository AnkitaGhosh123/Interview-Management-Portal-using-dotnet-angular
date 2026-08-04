using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InterviewApi.Models
{
    public class Interview
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CandidateId { get; set; }
        [ForeignKey("CandidateId")]
        public Candidate? Candidate { get; set; }

        [Required]
        public int InterviewerId { get; set; }
        [ForeignKey("InterviewerId")]
        public Interviewer? Interviewer { get; set; }

        [Required]
        public DateTime ScheduledAt { get; set; }

        [MaxLength(20)]
        public string Status { get; set; } = "Pending";

        [MaxLength(10)]
        public string? Level { get; set; }

        [MaxLength(20)]
        public string Result { get; set; } = "NotEvaluated";

        [MaxLength(500)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Feedback>? Feedbacks { get; set; }
    }
}