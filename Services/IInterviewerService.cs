using System.Collections.Generic;
using System.Threading.Tasks;
using InterviewApi.Models;
 
namespace InterviewApi.Services
{
    public interface IInterviewerService
    {
        Task<List<Interview>> GetAssignedInterviewsAsync(int interviewerId);
        Task<Interview> GetInterviewByIdAsync(int interviewId);
        Task<bool> SubmitFeedbackAsync(Feedback feedback);
        Task<List<Feedback>> GetFeedbacksByInterviewerAsync(int interviewerId);
    }
}