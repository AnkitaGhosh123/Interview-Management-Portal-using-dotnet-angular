
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../service/service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminHeader } from '../admin-header/admin-header';

@Component({
  selector: 'app-get-eligible-candidates',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, AdminHeader],
  templateUrl: './get-eligible-candidates.html',
  styleUrls: ['./get-eligible-candidates.scss']
})
export class GetEligibleCandidates implements OnInit {
  candidates: any[] = [];
  noCandidates = false;
  loading: boolean = false;
  
  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.adminService.getSelectedCandidates().subscribe({
      next: (res: any) => {
        if (res.message) {
          this.noCandidates = true;
          this.candidates = [];
        } else {
          this.candidates = res;
          this.noCandidates = false;
        }
      },
      error: () => {
        this.noCandidates = true;
      }
    });
  }

  navigateToOfferForm(candidate: any): void {
    this.router.navigate(['/generate-offer'], {
      state: { candidateId: candidate.candidateId, candidateName: candidate.name }
    });
  }
}