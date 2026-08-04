
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class InterviewerRegistrationRequest
{
    [Key]
    public int Id { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string SkillSet { get; set; }
    public string Level { get; set; }
    public int YearsOfExperience { get; set; }
    public string InterviewType { get; set; }
    public bool IsAvailable { get; set; } = false;
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
}
