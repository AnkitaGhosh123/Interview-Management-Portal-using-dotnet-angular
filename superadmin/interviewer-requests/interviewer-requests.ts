
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperadminService } from '../superadmin-service';
import { RouterLink } from '@angular/router';
import { SuperadminHeader } from '../superadmin-header/superadmin-header';

@Component({
  selector: 'app-interviewer-requests',
  standalone: true,
  templateUrl: './interviewer-requests.html',
  styleUrls: ['./interviewer-requests.scss'],
  imports: [CommonModule, RouterLink, SuperadminHeader]
})
export class InterviewerRequestsComponent implements OnInit {

  interviewerRequests: any[] = [];
  loading: boolean = false;

  constructor(private superAdminService: SuperadminService) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.superAdminService.getInterviewerRequests()
      .subscribe({
        next: (res: any) => { this.interviewerRequests = res; },
        error: (err: any) => console.error('Error fetching interviewer requests', err)
      });
  }

  approve(email: string) {
    this.superAdminService.approveInterviewer(email)
      .subscribe({
        next: () => this.loadRequests(),
        error: (err: any) => console.error('Error approving interviewer', err)
      });
  }

  reject(email: string) {
    this.superAdminService.rejectInterviewer(email)
      .subscribe({
        next: () => this.loadRequests(),
        error: (err: any) => console.error('Error rejecting interviewer', err)
      });
  }

}
