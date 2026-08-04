using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterviewApi.Data;
using InterviewApi.Models;
using Microsoft.EntityFrameworkCore;
 
namespace InterviewApi.Repositories
{
    public class InterviewRepository : IInterviewRepository
    {
        private readonly ApplicationDbContext _context;
 
        public InterviewRepository(ApplicationDbContext context)
        {
            _context = context;
        }
 
        // ✅ Get interview by ID
        public async Task<Interview> GetInterviewByIdAsync(int interviewId)
        {
            return await _context.Interviews
                .Include(i => i.Candidate)
                .Include(i => i.Interviewer)
                .FirstOrDefaultAsync(i => i.Id == interviewId);
        }
 
        // ✅ Get all interviews assigned to a specific interviewer
        public async Task<List<Interview>> GetInterviewsByInterviewerAsync(int interviewerId)
        {
            return await _context.Interviews
                .Include(i => i.Candidate)
                .Where(i => i.InterviewerId == interviewerId)
                .OrderByDescending(i => i.ScheduledAt)
                .ToListAsync();
        }
 
        // ✅ Get all interviews assigned to a specific candidate
        public async Task<List<Interview>> GetInterviewsByCandidateAsync(int candidateId)
        {
            return await _context.Interviews
                .Include(i => i.Interviewer)
                .Where(i => i.CandidateId == candidateId)
                .OrderByDescending(i => i.ScheduledAt)
                .ToListAsync();
        }
 
        // ✅ Add a new interview
        public async Task AddInterviewAsync(Interview interview)
        {
            await _context.Interviews.AddAsync(interview);
        }
 
        // ✅ Update existing interview (status, schedule, etc.)
        public async Task UpdateInterviewAsync(Interview interview)
        {
            _context.Interviews.Update(interview);
        }
 
        // ✅ Commit changes to database
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}