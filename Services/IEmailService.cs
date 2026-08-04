using System.Threading.Tasks;
using System.IO;
using System.Net.Mail;

 
namespace InterviewApi.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
        Task SendInterviewScheduledEmailAsync(string candidateEmail, string interviewerName, string scheduledDate);
        Task SendInterviewResultEmailAsync(string candidateEmail, string result);
        Task SendFeedbackRequestEmailAsync(string candidateEmail, string interviewDetails);
        Task SendEmailWithAttachmentAsync(string toEmail, string subject, string body, byte[] attachmentBytes, string attachmentName);
    }
}