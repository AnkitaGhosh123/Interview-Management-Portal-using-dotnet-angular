using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using InterviewApi.Data;
using InterviewApi.Models;
using InterviewApi.Services;
 
namespace InterviewApi.Services
{
    public class CandidateService : ICandidateService
    {
        private readonly ApplicationDbContext _context;
 
        public CandidateService(ApplicationDbContext context)
        {
            _context = context;
        }
 
        // ✅ 1. Get candidate by ID
        public async Task<Candidate> GetCandidateByIdAsync(int candidateId)
        {
            return await _context.Candidates
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.CandidateId == candidateId);
        }
 
        // ✅ 2. Get all interviews assigned to this candidate
        public async Task<List<Interview>> GetAssignedInterviewsAsync(int candidateId)
        {
            return await _context.Interviews
                .Include(i => i.Interviewer)
                .Include(i => i.Candidate)
                .Where(i => i.CandidateId == candidateId)
                .OrderByDescending(i => i.ScheduledAt)
                .ToListAsync();
        }
 
        // ✅ 3. Candidate submits feedback about the interview experience
        public async Task<bool> SubmitFeedbackAsync(Feedback feedback)
        {
            var interviewExists = await _context.Interviews.AnyAsync(i => i.Id == feedback.InterviewId);
            if (!interviewExists)
                return false;
 
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();
            return true;
        }
 
        // ✅ 4. Get all feedbacks submitted by this candidate
        public async Task<List<Feedback>> GetFeedbacksAsync(int candidateId)
        {
            return await _context.Feedbacks
                .Include(f => f.Interview)
                .Include(f => f.Candidate)
                .Where(f => f.CandidateId == candidateId)
                .OrderByDescending(f => f.SubmittedAt)
                .ToListAsync();
        }
    }
}
 