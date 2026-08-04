
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
public class AdminRegistrationRequest
{

    [Key]
    public int Id { get; set; }
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
}
