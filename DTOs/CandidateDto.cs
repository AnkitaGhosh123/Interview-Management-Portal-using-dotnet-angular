using System;
using System.ComponentModel.DataAnnotations;
 
namespace InterviewApi.DTOs
{
    public class CandidateDto
    {
        public int Id { get; set; }
 
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }
 
        [Required]
        [MaxLength(100)]
        public string SkillSet { get; set; }  // e.g., "Java", "Angular", "Python"
 
        [MaxLength(50)]
        public string PreferredInterviewType { get; set; }  // e.g., "Technical", "HR", "Managerial"
 
        [MaxLength(20)]
        public string InterviewStatus { get; set; }  // e.g., "NotAssigned", "Assigned", "Selected", "Rejected"
 
        [MaxLength(255)]
        public string ResumePath { get; set; }
 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
 
        public int UserId { get; set; }  // link back to the user table (foreign key)
    }
}
 