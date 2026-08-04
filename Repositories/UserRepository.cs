using System.Threading.Tasks;
using InterviewApi.Data;
using InterviewApi.Models;
using Microsoft.EntityFrameworkCore;
 
namespace InterviewApi.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;
 
        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }
 
        // ✅ Get user by email
        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
 
        // ✅ Get user by ID
        public async Task<User> GetUserByIdAsync(int userId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        }
 
        // ✅ Add a new user
        public async Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
        }
 
        // ✅ Save changes to database
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
 