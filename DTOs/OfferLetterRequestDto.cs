public class OfferDecisionRequest
{
    public required int CandidateId { get; set; }
    public required string Decision { get; set; } // "Accepted" or "Rejected"
}
