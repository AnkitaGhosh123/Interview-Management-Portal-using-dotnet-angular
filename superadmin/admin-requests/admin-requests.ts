import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperadminService } from '../superadmin-service';
import { RouterLink } from '@angular/router';
import { SuperadminHeader } from '../superadmin-header/superadmin-header';

 
@Component({
  selector: 'app-admin-requests',
  standalone: true,
  templateUrl: './admin-requests.html',
  styleUrls: ['./admin-requests.scss'],
  imports: [CommonModule,RouterLink,SuperadminHeader]
})
export class AdminRequestsComponent implements OnInit {
 
  adminRequests: any[] = [];
  loading: boolean = false;
 
  constructor(private superAdminService: SuperadminService) {}
 
  ngOnInit() {
    this.loadRequests();
  }
 
  loadRequests() {
    this.superAdminService.getAdminRequests()
      .subscribe({
        next: (res: any) => { this.adminRequests = res; },
        error: (err: any) => console.error('Error fetching admin requests', err)
      });
  }
 
  approve(email: string) {
    this.superAdminService.approveAdmin(email)
      .subscribe({
        next: () => this.loadRequests(),
        error: (err: any) => console.error('Error approving admin', err)
      });
  }
 
  reject(email: string) {
    this.superAdminService.rejectAdmin(email)
      .subscribe({
        next: () => this.loadRequests(),
        error: (err: any) => console.error('Error rejecting admin', err)
      });
  }
 
}
 