using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using InterviewApi.Services;
using Microsoft.Extensions.Configuration;

namespace InterviewApi.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        // ✅ Generic Email Sender
        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var fromEmail = _config["EmailSettings:From"];
            var password = _config["EmailSettings:Password"];
            var smtpHost = _config["EmailSettings:SmtpHost"];
            var smtpPort = int.Parse(_config["EmailSettings:SmtpPort"]);

            var message = new MailMessage();
            message.From = new MailAddress(fromEmail);
            message.To.Add(toEmail);
            message.Subject = subject;
            message.Body = body;
            message.IsBodyHtml = true;

            using (var client = new SmtpClient(smtpHost, smtpPort))
            {
                client.Credentials = new NetworkCredential(fromEmail, password);
                client.EnableSsl = true;
                await client.SendMailAsync(message);
            }
        }

        // ✅ 1. Send Interview Scheduled Notification
        public async Task SendInterviewScheduledEmailAsync(string candidateEmail, string interviewerName, string scheduledDate)
        {
            string subject = "Interview Scheduled";
            string body = $"Dear Candidate,<br/><br/>Your interview has been scheduled with <b>{interviewerName}</b> on <b>{scheduledDate}</b>.<br/><br/>Best wishes,<br/>Interview Management Team";
            await SendEmailAsync(candidateEmail, subject, body);
        }

        // ✅ 2. Send Interview Result (Accepted / Rejected)
        public async Task SendInterviewResultEmailAsync(string candidateEmail, string result)
        {
            string subject = "Interview Result Notification";
            string body = $"Dear Candidate,<br/><br/>We are pleased to inform you that your interview result is: <b>{result}</b>.<br/><br/>Best Regards,<br/>Interview Management Team";
            await SendEmailAsync(candidateEmail, subject, body);
        }

        // ✅ 3. Send Feedback Request once Interview Completed
        public async Task SendFeedbackRequestEmailAsync(string candidateEmail, string interviewDetails)
        {
            string subject = "Interview Feedback Request";
            string body = $"Dear Candidate,<br/><br/>Thank you for attending your interview.<br/>Please share your feedback regarding <b>{interviewDetails}</b>.<br/><br/>Kindly fill out the feedback form sent in your dashboard.<br/><br/>Thanks,<br/>Interview Management Team";
            await SendEmailAsync(candidateEmail, subject, body);
        }

        public async Task SendEmailWithAttachmentAsync(string toEmail, string subject, string body, byte[] attachmentBytes, string attachmentName)
        {
            var fromEmail = _config["EmailSettings:From"];
            var password = _config["EmailSettings:Password"];
            var smtpHost = _config["EmailSettings:SmtpHost"];
            var smtpPort = int.Parse(_config["EmailSettings:SmtpPort"]);

            var message = new MailMessage();
            message.From = new MailAddress(fromEmail);
            message.To.Add(toEmail);
            message.Subject = subject;
            message.Body = body;
            message.IsBodyHtml = true;

            // ✅ Attach PDF from memory
            if (attachmentBytes != null)
            {
                var stream = new MemoryStream(attachmentBytes);
                message.Attachments.Add(new Attachment(stream, attachmentName, "application/pdf"));
            }

            using (var client = new SmtpClient(smtpHost, smtpPort))
            {
                client.Credentials = new NetworkCredential(fromEmail, password);
                client.EnableSsl = true;
                await client.SendMailAsync(message);
            }
        }

    }
}
