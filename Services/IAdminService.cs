using System.Collections.Generic;
using System.Threading.Tasks;
using InterviewApi.DTOs;
using InterviewApi.Models;
 
namespace InterviewApi.Services
{
    public interface IAdminService
    {
        Task<string> AssignInterviewerAsync(AssignDto assignDto);
        Task<List<User>> GetAllInterviewersAsync();
        Task<List<User>> GetAllCandidatesAsync();
        Task<List<Interview>> GetAllInterviewsAsync();
    }
}