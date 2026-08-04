import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../candidate-service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CandidateHeader } from '../candidate-header/candidate-header';

@Component({
  selector: 'app-interview-status',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule,CandidateHeader],
  templateUrl: './check-interview-status.html',
  styleUrls: ['./check-interview-status.scss']
})
export class InterviewStatusComponent implements OnInit {
  status: string | null = null;
  candidateName: string | null = null;
  errorMessage = '';
  loading: boolean = false;
  constructor(private candidateService: CandidateService) {}

  ngOnInit() {
    // ✅ Fetch candidateId from localStorage (set during login)
    const candidateId = Number(localStorage.getItem('candidateId'));
    if (!candidateId) {
      this.errorMessage = 'Candidate ID missing. Please log in again.';
      return;
    }

    // ✅ Call API automatically
    this.candidateService.getInterviewStatus(candidateId).subscribe({
      next: (res: any) => {
        this.status = res.interviewStatus || null;
        this.candidateName = res.name || 'N/A'; // Backend should return name
        this.errorMessage = '';
      },
      error: (err) => {
        this.status = null;
        if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Access unauthorized: You are not allowed to view this information.';
        } else if (err.status === 404) {
          this.errorMessage = 'Candidate not found.';
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
      }
    });
  }
}