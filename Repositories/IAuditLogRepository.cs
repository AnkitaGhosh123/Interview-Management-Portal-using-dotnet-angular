using System.Collections.Generic;
using System.Threading.Tasks;
using InterviewApi.Models;
 
namespace InterviewApi.Repositories
{
    public interface IAuditLogRepository
    {
        Task AddLogAsync(AuditLog log);
        Task<List<AuditLog>> GetAllLogsAsync();
        Task SaveChangesAsync();
    }
}