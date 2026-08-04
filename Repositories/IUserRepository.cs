using System.Threading.Tasks;
using InterviewApi.Models;
 
namespace InterviewApi.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByIdAsync(int userId);
        Task AddUserAsync(User user);
        Task SaveChangesAsync();
    }
}