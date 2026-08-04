using System.Threading.Tasks;
using InterviewApi.DTOs;
using InterviewApi.Models;
 
namespace InterviewApi.Services
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterDto registerDto);
        Task<(string token, User user)> LoginAsync(LoginDto loginDto);
    }
}