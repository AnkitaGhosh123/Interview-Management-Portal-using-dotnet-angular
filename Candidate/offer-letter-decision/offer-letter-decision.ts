
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../candidate-service';
import { Router, RouterLink } from '@angular/router';
import { CandidateHeader } from '../candidate-header/candidate-header';

@Component({
  selector: 'app-offer-decision',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CandidateHeader],
  templateUrl: './offer-letter-decision.html',
  styleUrls: ['./offer-letter-decision.scss']
})
export class CandidateOfferDecision implements OnInit {
  decisionForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  resultData: any = null;
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private router: Router
  ) {
    this.decisionForm = this.fb.group({
      decision: ['', [Validators.required, Validators.pattern(/^(Accepted|Rejected)$/)]]
    });
  }

  ngOnInit() {
    const candidateId = Number(localStorage.getItem('candidateId'));
    if (!candidateId) {
      this.errorMessage = 'Candidate ID missing. Please log in again.';
      return;
    }

    // Fetch interview result and status
    this.candidateService.getInterviewResult(candidateId).subscribe({
      next: (res: any) => {
        this.resultData = res;
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Access unauthorized: Please log in again.';
        } else if (err.status === 404) {
          this.errorMessage = err.error || 'Candidate or Interview not found.';
        } else {
          this.errorMessage = 'Server error. Please check API URL or backend.';
        }
      }
    });
  }

  onSubmit() {
    if (this.decisionForm.invalid) {
      this.errorMessage = 'Please select a valid decision (Accepted or Rejected).';
      return;
    }

    const candidateId = Number(localStorage.getItem('candidateId'));
    const requestData = {
      CandidateId: candidateId,
      Decision: this.decisionForm.get('decision')?.value
    };

    this.candidateService.offerDecision(requestData).subscribe({
      next: (res) => {
        this.successMessage = res?.message || 'Decision submitted successfully!';
        this.errorMessage = '';
        alert(this.successMessage); // Show alert
        this.decisionForm.reset();
        this.router.navigate(['/dashboard']); // Navigate to dashboard
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Access unauthorized: You are not allowed to submit offer decision.';
        } else if (err.status === 404) {
          this.errorMessage = err.error?.message || 'No offer letter found for this candidate.';
        } else if (err.status === 400) {
          this.errorMessage = err.error?.message || 'Invalid decision.';
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
      }
    });
  }
}
