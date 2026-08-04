
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../service/service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminHeader } from '../admin-header/admin-header';

@Component({
  selector: 'app-reschedule-interview',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminHeader],
  templateUrl: './reschedule-interview.html',
  styleUrls: ['./reschedule-interview.scss']
})
export class RescheduleInterviewComponent implements OnInit {
  rescheduledCandidates: any[] = [];
  backendMessage = '';

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.loadRescheduledCandidates();
  }

  loadRescheduledCandidates() {
    this.adminService.getRescheduledCandidates().subscribe((res: any) => {
      if (Array.isArray(res)) {
        this.rescheduledCandidates = res;
        this.backendMessage = '';
      } else {
        this.rescheduledCandidates = [];
        this.backendMessage = res.message || 'No rescheduled candidates found.';
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin-dashboard']); // Adjust route if needed
  }
}
