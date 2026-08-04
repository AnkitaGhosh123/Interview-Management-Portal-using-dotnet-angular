using System.Collections.Generic;
using System.Threading.Tasks;
using InterviewApi.Data;
using InterviewApi.Models;
using Microsoft.EntityFrameworkCore;
 
namespace InterviewApi.Repositories
{
    public class AuditLogRepository : IAuditLogRepository
    {
        private readonly ApplicationDbContext _context;
 
        public AuditLogRepository(ApplicationDbContext context)
        {
            _context = context;
        }
 
        // ✅ Add a new audit log
        public async Task AddLogAsync(AuditLog log)
        {
            await _context.AuditLogs.AddAsync(log);
        }
 
        // ✅ Retrieve all logs
        public async Task<List<AuditLog>> GetAllLogsAsync()
        {
            return await _context.AuditLogs
                .OrderByDescending(l => l.Timestamp)
                .ToListAsync();
        }
 
        // ✅ Commit changes
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
 