
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../candidate-service';
import { RouterLink } from '@angular/router';
import { CandidateHeader } from '../candidate-header/candidate-header';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CandidateHeader],
  templateUrl: './give-feedback.html',
  styleUrls: ['./give-feedback.scss']
})
export class CandidateFeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  candidateId!: number;
  feedbackSubmitted = false;
  successMessage = '';
  errorMessage = '';
  ratings = [1, 2, 3, 4, 5];
  interviewStatus = '';
  interviewId: number | null = null;
  interviewerId: number | null = null;
  interviewerName = '';
  loading: boolean = false;

  constructor(private fb: FormBuilder, private candidateService: CandidateService) {
    this.feedbackForm = this.fb.group({
      comments: ['', [Validators.required, Validators.minLength(5)]],
      rating: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.candidateId = Number(localStorage.getItem('candidateId'));
    if (!this.candidateId) {
      this.errorMessage = 'Candidate ID missing. Please log in again.';
      return;
    }

    this.checkFeedbackStatus();
    this.getInterviewStatus();
    this.getAssignedInterview();
  }

  checkFeedbackStatus() {
    this.candidateService.checkFeedbackStatus(this.candidateId).subscribe({
      next: (res: any) => {
        this.feedbackSubmitted = res.alreadySubmitted;
        this.successMessage = '';
      },
      error: () => {
        this.errorMessage = 'Error checking feedback status.';
      }
    });
  }

  getInterviewStatus() {
    this.candidateService.getInterviewStatus(this.candidateId).subscribe({
      next: (res: any) => {
        this.interviewStatus = res.interviewStatus;
      },
      error: () => {
        this.errorMessage = 'Error fetching interview status.';
      }
    });
  }

  getAssignedInterview() {
    this.candidateService.getAssignedInterview(this.candidateId).subscribe({
      next: (res: any) => {
        this.interviewId = res.interviewId || null;
        this.interviewerId = res.interviewerId || null;
        this.interviewerName = res.interviewerName || '';
      },
      error: () => {
        this.interviewId = null;
        this.interviewerId = null;
        this.interviewerName = '';
        // Don't set errorMessage here, let the form logic handle it
      }
    });
  }

  onSubmit() {
    if (this.feedbackForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    const feedbackData = {
      InterviewId: this.interviewId,
      InterviewerId: this.interviewerId,
      Comments: this.feedbackForm.get('comments')?.value,
      Rating: this.feedbackForm.get('rating')?.value
    };

    this.candidateService.submitFeedback(this.candidateId, feedbackData).subscribe({
      next: () => {
        this.feedbackForm.reset();
        this.feedbackSubmitted = true;
        this.successMessage = 'Feedback submitted successfully!';
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error || 'Something went wrong. Please try again.';
      }
    });
  }

  showAlert() {
    alert('Sorry! Feedback form is not active yet.');
  }
}