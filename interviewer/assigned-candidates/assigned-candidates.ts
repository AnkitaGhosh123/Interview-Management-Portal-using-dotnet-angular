
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterviewerService } from '../interviewer-service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from '../header/header';

@Component({
  selector: 'app-assigned-candidates',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, HeaderComponent], 
  templateUrl: './assigned-candidates.html',
  styleUrls: ['./assigned-candidates.scss']
})
export class AssignedCandidates implements OnInit {
  candidates: any[] = [];
  loading: boolean = false;
  message = '';
  private isBrowser: boolean;

  constructor(
    private interviewerService: InterviewerService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    // ✅ SSR-safe flag: only true in the browser
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // ✅ Only access localStorage in the browser
    if (this.isBrowser) {
      try {
        const interviewerIdStr = localStorage.getItem('interviewerId');
        if (interviewerIdStr) {
          const interviewerId = Number.parseInt(interviewerIdStr, 10);
          if (!Number.isNaN(interviewerId)) {
            this.loadCandidates(interviewerId);
          } else {
            this.message = 'Invalid interviewer ID.';
          }
        } else {
          this.message = 'User not logged in.';
        }
      } catch (e) {
        console.warn('Failed to access localStorage:', e);
        this.message = 'Storage access error.';
      }
    } else {
      // SSR / Node runner: neutral fallback
      this.message = 'Loading in server context; candidates will load on the client.';
      this.candidates = [];
    }
  }

  loadCandidates(id: number): void {
    this.interviewerService.getAssignedCandidates(id).subscribe({
      next: (data: any) => {
        this.candidates = Array.isArray(data?.candidates) ? data.candidates : [];
        this.message = data?.message ?? (this.candidates.length ? '' : 'No candidates assigned.');
      },
      error: (err: any) => {
        this.message = err?.error?.message ?? 'Failed to load candidates.';
        console.error(err);
      }
    });
  }

  downloadResume(candidateId: number): void {
    this.interviewerService.downloadResume(candidateId).subscribe({
      next: (blob: Blob) => {
        // ✅ Only use window APIs in the browser
        if (!this.isBrowser) {
          console.warn('Download skipped: not running in browser.');
          return;
        }
        try {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `resume_${candidateId}.pdf`;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } catch (e) {
          console.error('Download failed:', e);
        }
      },
      error: (err: any) => {
        console.error('Download failed', err);
      }
    });
  }

  navigateToReschedule(candidateId: number): void {
    this.router.navigate(['/reschedule', candidateId]);
  }
}
