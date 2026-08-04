
// feedback.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../service/service';
import { Router, RouterLink } from '@angular/router';
import { AdminHeader } from '../admin-header/admin-header';

interface FeedbackVm {
  candidateId: number | null;
  candidateName: string | null;
  interviewerId: number | null;
  interviewerName: string | null;
  interviewId: number | null;
  rating: number | null;
  feedbackText: string | null;
  submittedAt: string | null; // ISO string from backend
}

@Component({
  selector: 'app-feedbacks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminHeader],
  providers: [DatePipe],
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.scss']
})
export class FeedbacksComponent implements OnInit {
  loading = false;
  errorMessage = '';
  successMessage = '';
  searchText = '';

  feedbacks: FeedbackVm[] = [];

constructor(private adminService: AdminService, private datePipe: DatePipe, private router: Router) {}

  ngOnInit(): void {
    this.fetchFeedbacks();
  }

  fetchFeedbacks(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.adminService.getAllCandidateFeedbacks().subscribe({
      next: (res: FeedbackVm[]) => {
        this.feedbacks = Array.isArray(res) ? res : [];
        this.successMessage = `Loaded ${this.feedbacks.length} feedback(s).`;
        this.loading = false;
      },
      error: (err) => {
        // Backend may return 404 with "No feedbacks found."
        this.errorMessage = (err?.error && typeof err.error === 'string')
          ? err.error
          : 'Failed to load feedbacks.';
        this.loading = false;
      }
    });
  }

  refresh(): void {
    this.searchText = '';
    this.fetchFeedbacks();
  }
  
goBack(): void {
  this.router.navigate(['/admin-dashboard']); // change route if you want a different page
}

  formatDate(d: string | null): string {
    if (!d) return '—';
    // Uses local time formatting
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? d : parsed.toLocaleString();
  }

  get filteredFeedbacks(): FeedbackVm[] {
    const q = this.searchText.trim().toLowerCase();
    if (!q) return this.feedbacks;
    return this.feedbacks.filter(f => {
      const cand = (f.candidateName || '').toLowerCase();
      const intv = (f.interviewerName || '').toLowerCase();
      const text = (f.feedbackText || '').toLowerCase();
      const rating = String(f.rating ?? '').toLowerCase();
      const interviewId = String(f.interviewId ?? '').toLowerCase();
      const candidateId = String(f.candidateId ?? '').toLowerCase();
      const interviewerId = String(f.interviewerId ?? '').toLowerCase();

      return (
        cand.includes(q) ||
        intv.includes(q) ||
        text.includes(q) ||
        rating.includes(q) ||
        interviewId.includes(q) ||
        candidateId.includes(q) ||
        interviewerId.includes(q)
      );
    });
  }

  trackByIndex(index: number): number {
    return index;
  }
}
