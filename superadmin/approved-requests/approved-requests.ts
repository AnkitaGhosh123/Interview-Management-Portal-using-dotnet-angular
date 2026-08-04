
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperadminService } from '../superadmin-service';
import { RouterLink } from '@angular/router';
import { SuperadminHeader } from '../superadmin-header/superadmin-header';

@Component({
  selector: 'app-approved-requests',
  standalone: true,
  templateUrl: './approved-requests.html',
  styleUrls: ['./approved-requests.scss'],
  imports: [CommonModule, RouterLink, SuperadminHeader]
})
export class ApprovedRequestsComponent implements OnInit {

  approvedAdmins: any[] = [];
  approvedInterviewers: any[] = [];
  loading: boolean = false;

  constructor(private superAdminService: SuperadminService) {}

  ngOnInit() {
    this.loadApprovedRequests();
  }

  loadApprovedRequests() {
    this.superAdminService.getAdminRequestsApproved()
      .subscribe({
        next: (res: any) => this.approvedAdmins = res,
        error: (err: any) => console.error('Error fetching approved admins', err)
      });

    this.superAdminService.getInterviewerRequestsApproved()
      .subscribe({
        next: (res: any) => this.approvedInterviewers = res,
        error: (err: any) => console.error('Error fetching approved interviewers', err)
      });
  }
}
