
// forward-feedback.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../service/service';
import { Router, RouterLink } from '@angular/router';
import { AdminHeader } from '../admin-header/admin-header';

interface ForwardPayload {
  InterviewerId: number;
}

interface FeedbackDetail {
  InterviewId: number | null;
  Rating: number | null;
  FeedbackText: string | null;
  SubmittedAt: string | null; // ISO string
}

interface ForwardResponse {
  InterviewerId: number;
  TotalFeedbacks: number;
  FeedbackDetails: FeedbackDetail[];
}

@Component({
  selector: 'app-forward-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminHeader],
  templateUrl: './forward-feedback.html',
  styleUrls: ['./forward-feedback.scss']
})
export class ForwardFeedbackComponent {
  interviewerId!: number;

  loading = false;
  errorMessage = '';
  successMessage = '';

  totalFeedbacks = 0;
  feedbacks: FeedbackDetail[] = [];

  // local filter
  searchText = '';

    constructor(private adminService: AdminService, private router: Router) {}


  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.totalFeedbacks = 0;
    this.feedbacks = [];

    if (!this.interviewerId || this.interviewerId <= 0) {
      this.errorMessage = 'InterviewerId is required.';
      return;
    }

    const payload: ForwardPayload = { InterviewerId: this.interviewerId };

    this.loading = true;
    this.adminService.forwardFeedback(payload).subscribe({
      next: (res: ForwardResponse) => {
        this.totalFeedbacks = res?.TotalFeedbacks ?? 0;
        this.feedbacks = Array.isArray(res?.FeedbackDetails) ? res.FeedbackDetails : [];
        this.successMessage = `Fetched ${this.totalFeedbacks} feedback(s) for Interviewer ID ${res?.InterviewerId}.`;
        this.loading = false;
      },
      error: (err) => {
        // Backend can return 404 "No feedback found for this interviewer."
        this.errorMessage = (err?.error && typeof err.error === 'string')
          ? err.error
          : 'Failed to forward feedback.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    // Option 1: navigate to a specific route
    this.router.navigate(['/admin-dashboard']);
    // Option 2 (if you want literal browser back):
    // window.history.back();
  }
  reset(): void {
    this.interviewerId = undefined as unknown as number;
    this.searchText = '';
    this.totalFeedbacks = 0;
    this.feedbacks = [];
    this.errorMessage = '';
    this.successMessage = '';
  }

  
  formatDate(d: string | null): string {
    if (!d) return '—';
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? d : parsed.toLocaleString();
  }

  get filteredFeedbacks(): FeedbackDetail[] {
    const q = this.searchText.trim().toLowerCase();
    if (!q) return this.feedbacks;
    return this.feedbacks.filter(f => {
      const interviewId = String(f.InterviewId ?? '').toLowerCase();
      const rating = String(f.Rating ?? '').toLowerCase();
      const text = (f.FeedbackText || '').toLowerCase();
      const submitted = (f.SubmittedAt || '').toLowerCase();
      return (
        interviewId.includes(q) ||
        rating.includes(q) ||
        text.includes(q) ||
        submitted.includes(q)
      );
    });
  }

  trackByIndex(index: number): number {
    return index;
  }
}
