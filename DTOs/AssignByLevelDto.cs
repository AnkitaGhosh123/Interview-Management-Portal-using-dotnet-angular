using System.ComponentModel.DataAnnotations;

namespace InterviewApi.DTOs
{
    public class AssignByLevelDto
    {
        [Required]
        public int CandidateId { get; set; }

        [Required]
        [MaxLength(10)]
        public string Level { get; set; }
    }
}