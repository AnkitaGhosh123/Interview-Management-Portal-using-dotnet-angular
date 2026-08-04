
import { Component, OnInit } from '@angular/core';
import { InterviewerService } from '../interviewer-service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header';


@Component({
  selector: 'app-give-decision',
  imports:[CommonModule,FormsModule,ReactiveFormsModule,RouterLink, HeaderComponent],
  templateUrl: './decision.html',
  styleUrls: ['./decision.scss']
})
export class GiveDecision implements OnInit {
  candidates: any[] = [];
  loading: boolean = false;
  interviewerId: number = 0;
  errorMessage = '';

  constructor(private interviewerService: InterviewerService) {}

  ngOnInit(): void {
    this.interviewerId = Number(localStorage.getItem('interviewerId')); // Ensure this is set during login
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.loading = true;
    this.interviewerService.getCompletedCandidates(this.interviewerId).subscribe({
      next: (res: { candidates: never[]; }) => {
        console.log('API Response:', res);
        this.candidates = res.candidates || []; // ✅ lowercase key
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.errorMessage = 'Failed to load candidates.';
        this.loading = false;
      }
    });
  }

  acceptCandidate(candidateId: number): void {
    this.interviewerService.giveDecision(candidateId, this.interviewerId, 'Accepted').subscribe({
      next: () => {
        alert('Candidate accepted, decision saved and sent to admin');
        this.removeCandidate(candidateId);
      },
      error: (err: any) => console.error(err)
    });
  }

  rejectCandidate(candidateId: number): void {
    this.interviewerService.giveDecision(candidateId, this.interviewerId, 'Rejected').subscribe({
      next: () => {
        alert('Candidate rejected, decision saved and sent to admin');
        this.removeCandidate(candidateId);
      },
      error: (err: any) => console.error(err)
    });
  }

  removeCandidate(candidateId: number): void {
    this.candidates = this.candidates.filter(c => c.candidateId !== candidateId);
  }
}
