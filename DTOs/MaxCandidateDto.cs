using System.ComponentModel.DataAnnotations;

namespace InterviewApi.DTOs
{
    public class MaxCandidateDto
    {
        [Required]
        public int InterviewerId { get; set; }

        [Required]
        public int MaxCandidates { get; set; }
    }
}