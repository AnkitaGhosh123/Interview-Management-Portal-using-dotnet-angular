
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { InterviewerService } from '../interviewer-service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from '../header/header';

@Component({
  selector: 'app-complete-interview',
  imports:[CommonModule,FormsModule,ReactiveFormsModule,RouterLink, HeaderComponent],
  standalone: true,
  templateUrl: './completed-interview.html',
  styleUrls: ['./completed-interview.scss']
})
export class CompleteInterview implements OnInit {
  candidates: any[] = [];
  loading: boolean = false;
  selectedCandidates: number[] = [];
  message: string = '';

  private isBrowser: boolean;

  constructor(
    private interviewerService: InterviewerService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    // ✅ SSR-safe flag
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    // ✅ Only access localStorage in the browser
    if (this.isBrowser) {
      try {
        const interviewerId = localStorage.getItem('interviewerId');
        if (interviewerId) {
          this.loadCandidates(parseInt(interviewerId, 10));
        } else {
          // Optional: keep silent like your original, or show a message
          this.message = 'User not logged in.';
        }
      } catch (e) {
        // Defensive catch to avoid crashing on storage errors
        console.warn('Failed to access localStorage:', e);
        this.message = 'Storage access error.';
      }
    } else {
      // Neutral fallback during SSR / Node execution (prevents crash)
      this.message = 'Preparing view…';
    }
  }

  loadCandidates(id: number) {
    this.interviewerService.getAssignedCandidates(id).subscribe({
      next: (data: any) => {
        this.candidates = (data.candidates || []).map((c: any) => ({
          ...c,
          selected: false,
          completed: c.interviewStatus === 'Interview Completed'
        }));
      },
      error: () => this.message = 'Failed to load candidates.'
    });
  }

  onSelect(candidate: any) {
    if (candidate.selected) {
      this.selectedCandidates.push(candidate.candidateId);
    } else {
      this.selectedCandidates = this.selectedCandidates.filter(id => id !== candidate.candidateId);
    }
  }

  markCompleted() {
    this.interviewerService.markInterviewsComplete(this.selectedCandidates).subscribe({
      next: (res: any) => {
        this.message = res.message;
        // Remove completed candidates from list
        this.candidates = this.candidates.filter(c => !this.selectedCandidates.includes(c.candidateId));
        this.selectedCandidates = [];
        setTimeout(() => this.router.navigate(['/interviewer-dashboard']), 1500);
      },
      error: () => this.message = 'Failed to mark interviews as completed.'
    });
  }
}
