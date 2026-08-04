
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../candidate-service';
import { RouterLink } from '@angular/router';
import { CandidateHeader } from '../candidate-header/candidate-header';

@Component({
  selector: 'app-interview-result',
  standalone: true,
  imports: [CommonModule, RouterLink, CandidateHeader],
  templateUrl: './check-interview-result.html',
  styleUrls: ['./check-interview-result.scss']
})
export class InterviewResult implements OnInit {
  resultData: any = null;
  errorMessage = '';
  loading: boolean = false;
  constructor(private candidateService: CandidateService) { }

  ngOnInit() {
    const candidateId = Number(localStorage.getItem('candidateId'));
    if (!candidateId) {
      this.errorMessage = 'Candidate ID missing. Please log in again.';
      return;
    }

    // ✅ Check interview status first

    const interviewStatus = (localStorage.getItem('interviewStatus') || '').toLowerCase().trim();
    if (interviewStatus !== 'interview completed') {
      this.errorMessage = 'Your interview is not done yet!';
      return;
    }


    // ✅ If completed, fetch result
    this.candidateService.getInterviewResult(candidateId).subscribe({
      next: (res) => {
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
}
