
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../service/service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminHeader } from '../admin-header/admin-header';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, AdminHeader],
  templateUrl: './candidate-list.html',
  styleUrls: ['./candidate-list.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CandidateListComponent implements OnInit {
  candidates: any[] = [];

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.loadCandidates();
  }

  // ✅ Separate method for reloading candidates
  loadCandidates() {
    this.adminService.getCandidatesForAssignment().subscribe((res: any) => {
      console.log('API Response:', res);
      this.candidates = Array.isArray(res) ? res : res.data || [];
    });
  }

  // ✅ Navigate to assign interviewer page
  navigateToAssign(candidate: any) {
    this.router.navigate(['/assign-interviewer'], { state: { candidate } });
  }

  // ✅ Back button navigation
  goBack() {
    this.router.navigate(['/admin-dashboard']); // Adjust route if dashboard path differs
  }
}
