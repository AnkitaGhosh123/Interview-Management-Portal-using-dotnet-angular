using System.Collections.Generic;
using System.Threading.Tasks;
using InterviewApi.Models;
 
namespace InterviewApi.Repositories
{
    public interface IInterviewRepository
    {
        Task<Interview> GetInterviewByIdAsync(int interviewId);
        Task<List<Interview>> GetInterviewsByInterviewerAsync(int interviewerId);
        Task<List<Interview>> GetInterviewsByCandidateAsync(int candidateId);
        Task AddInterviewAsync(Interview interview);
        Task UpdateInterviewAsync(Interview interview);
        Task SaveChangesAsync();
    }
}