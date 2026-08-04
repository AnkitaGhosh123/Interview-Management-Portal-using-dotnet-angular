using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using InterviewApi.Services;
using InterviewApi.Data;
using InterviewApi.DTOs;
using InterviewApi.Models;
 
namespace InterviewApi.Services
{
    public class AdminService : IAdminService
    {
        private readonly ApplicationDbContext _context;
 
        public AdminService(ApplicationDbContext context)
        {
            _context = context;
        }
 
        // ✅ Assign an interviewer to a candidate
        public async Task<string> AssignInterviewerAsync(AssignDto assignDto)
        {
            var interviewer = await _context.Users.FirstOrDefaultAsync(u => u.UserId == assignDto.InterviewerId && u.Role == "Interviewer");
            var candidate = await _context.Users.FirstOrDefaultAsync(u => u.UserId == assignDto.CandidateId && u.Role == "Candidate");
 
            if (interviewer == null)
                return "Invalid interviewer.";
            if (candidate == null)
                return "Invalid candidate.";
 
            var interview = new Interview
            {
                InterviewerId = interviewer.UserId,
                CandidateId = candidate.UserId,
                ScheduledAt = assignDto.ScheduledDate,
                Status = "Scheduled"
            };
 
            _context.Interviews.Add(interview);
            await _context.SaveChangesAsync();
 
            // Log assignment
            var log = new AuditLog
            {
                Action = $"Assigned {interviewer.FullName} to {candidate.FullName}",
                PerformedBy = "Admin",
                Timestamp = DateTime.Now
            };
 
            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
 
            return "Assignment successful.";
        }
 
        // ✅ Get list of all interviewers
        public async Task<List<User>> GetAllInterviewersAsync()
        {
            return await _context.Users
                .Where(u => u.Role == "Interviewer")
                .ToListAsync();
        }
 
        // ✅ Get list of all candidates
        public async Task<List<User>> GetAllCandidatesAsync()
        {
            return await _context.Users
                .Where(u => u.Role == "Candidate")
                .ToListAsync();
        }
 
        // ✅ Get all interviews with details
        public async Task<List<Interview>> GetAllInterviewsAsync()
        {
            return await _context.Interviews
                .Include(i => i.Interviewer)
                .Include(i => i.Candidate)
                .ToListAsync();
        }
    }
}
 