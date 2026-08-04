
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperadminService } from '../superadmin-service';
import { RouterLink } from '@angular/router';
import { SuperadminHeader } from '../superadmin-header/superadmin-header';

@Component({
  selector: 'app-rejected-requests',
  standalone: true,
  templateUrl: './rejected-requests.html',
  styleUrls: ['./rejected-requests.scss'],
  imports: [CommonModule, RouterLink, SuperadminHeader]
})
export class RejectedRequestsComponent implements OnInit {

  rejectedAdmins: any[] = [];
  rejectedInterviewers: any[] = [];
  loading: boolean = false;
  
  constructor(private superAdminService: SuperadminService) {}

  ngOnInit() {
    this.loadRejectedRequests();
  }

  loadRejectedRequests() {
    this.superAdminService.getAdminRequestsRejected()
      .subscribe({
        next: (res: any) => this.rejectedAdmins = res,
        error: (err: any) => console.error('Error fetching rejected admins', err)
      });

    this.superAdminService.getInterviewerRequestsRejected()
      .subscribe({
        next: (res: any) => this.rejectedInterviewers = res,
        error: (err: any) => console.error('Error fetching rejected interviewers', err)
      });
  }
}
