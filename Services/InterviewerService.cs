using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using InterviewApi.Data;
using InterviewApi.Models;
 
namespace InterviewApi.Services
{
    public class InterviewerService : IInterviewerService
    {
        private readonly ApplicationDbContext _context;
 
        public InterviewerService(ApplicationDbContext context)
        {
            _context = context;
        }
 
        // ✅ 1. Get all interviews assigned to a particular interviewer
        public async Task<List<Interview>> GetAssignedInterviewsAsync(int interviewerId)
        {
            return await _context.Interviews
                .Include(i => i.Candidate)
                .Where(i => i.InterviewerId == interviewerId)
                .OrderByDescending(i => i.ScheduledAt)
                .ToListAsync();
        }
 
        // ✅ 2. Get a specific interview by ID
        public async Task<Interview> GetInterviewByIdAsync(int interviewId)
        {
            return await _context.Interviews
                .Include(i => i.Candidate)
                .Include(i => i.Interviewer)
                .FirstOrDefaultAsync(i => i.Id == interviewId);
        }
 
        // ✅ 3. Submit feedback for an interview
        public async Task<bool> SubmitFeedbackAsync(Feedback feedback)
        {
            // Optional validation
            var interviewExists = await _context.Interviews.AnyAsync(i => i.Id == feedback.InterviewId);
            if (!interviewExists)
                return false;
 
            // Save feedback
            _context.Feedbacks.Add(feedback);
 
            // Update interview status
            var interview = await _context.Interviews.FindAsync(feedback.InterviewId);
            if (interview != null)
            {
                interview.Status = "Completed";
            }
 
            await _context.SaveChangesAsync();
            return true;
        }
 
        // ✅ 4. Get all feedbacks submitted by this interviewer
        public async Task<List<Feedback>> GetFeedbacksByInterviewerAsync(int interviewerId)
        {
            return await _context.Feedbacks
                .Include(f => f.Candidate)
                .Include(f => f.Interview)
                .Where(f => f.Interview.InterviewerId == interviewerId)
                .OrderByDescending(f => f.SubmittedAt)
                .ToListAsync();
        }
    }
}
 