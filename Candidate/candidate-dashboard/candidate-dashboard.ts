import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CandidateHeader } from '../candidate-header/candidate-header';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CandidateHeader],
  templateUrl: './candidate-dashboard.html',
  styleUrls: ['./candidate-dashboard.scss']
})
export class CandidateDashboardComponent implements OnInit {
  isAuthorized = false;
  candidateId!: number; // ✅ Store candidateId from JWT

  constructor(private router: Router) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        this.isAuthorized = Date.now() < exp;

        // ✅ Extract candidateId from JWT payload
        this.candidateId = payload.candidateId;

        if (payload.interviewStatus) {
          localStorage.setItem('interviewStatus', payload.interviewStatus);
        }

      } catch (error) {
        console.error('Invalid token format:', error);
        this.isAuthorized = false;
      }
    }
  }

  // ✅ Navigation helper
  navigate(path: string) {
    this.router.navigate([path]);
  }
}