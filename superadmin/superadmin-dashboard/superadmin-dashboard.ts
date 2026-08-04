
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SuperadminService } from '../superadmin-service';
import { superAdminGuard } from '../../superadminauth.guard';
import { SuperadminHeader } from '../superadmin-header/superadmin-header';

@Component({
  selector: 'app-superadmin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, SuperadminHeader],
  styleUrls: ['./superadmin-dashboard.scss'],
  templateUrl: './superadmin-dashboard.html'
})
export class SuperAdminDashboard implements OnInit {

  pendingCount: number = 0;

  constructor(private superAdminService: SuperadminService) {}

  ngOnInit() {
    this.loadPendingCount();
  }

  loadPendingCount() {
    this.superAdminService.getPendingCount()
      .subscribe({
        next: (res: any) => {
          this.pendingCount = res.totalPending; // matches backend response { totalPending }
        },
        error: (err: any) => console.error('Error fetching pending count', err)
      });
  }
}
