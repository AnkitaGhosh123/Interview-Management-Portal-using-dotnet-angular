
using Microsoft.AspNetCore.Http;
public class CandidateRegisterDto
{
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string ConfirmPassword { get; set; }
    public required string SkillSet { get; set; }
    public required string TotalYearsOfExperience { get; set; }

    public string? RecentEducation { get; set; }       // e.g., "B.Tech in CSE"
    public string? UniversityName { get; set; }       // e.g., "IIT Bombay"
    public string? AverageCGPA { get; set; }          // e.g., "8.5"
    public List<string>? Projects { get; set; }       // e.g., ["E-commerce App", "Chatbot"]
    public List<string>? Internships { get; set; }    // e.g., ["Intern at XYZ"]

}