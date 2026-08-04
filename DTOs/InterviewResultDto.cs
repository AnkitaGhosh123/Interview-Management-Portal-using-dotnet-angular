using System;
using System.ComponentModel.DataAnnotations;
 
namespace InterviewApi.DTOs
{
    public class InterviewResultDto
    {
        [Required]
        public int InterviewId { get; set; }
 
        //[Required]
        public int CandidateId { get; set; }
 
        [Required]
        public int InterviewerId { get; set; }
 
        [Required]
        [MaxLength(20)]
        public string? ResultStatus { get; set; }  // "Accepted" or "Rejected"
 
        [MaxLength(1000)]
        public string? Comments { get; set; }  // interviewer’s comments
 
        public DateTime? UpdatedAt { get; set; } 
        public bool? IsAccepted { get; internal set; }
    }
}
 