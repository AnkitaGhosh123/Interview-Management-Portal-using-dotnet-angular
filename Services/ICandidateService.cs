using System.Collections.Generic;
using System.Threading.Tasks;
using InterviewApi.Models;
 
namespace InterviewApi.Services
{
    public interface ICandidateService
    {
        Task<Candidate> GetCandidateByIdAsync(int candidateId);
        Task<List<Interview>> GetAssignedInterviewsAsync(int candidateId);
        Task<bool> SubmitFeedbackAsync(Feedback feedback);
        Task<List<Feedback>> GetFeedbacksAsync(int candidateId);
    }
}