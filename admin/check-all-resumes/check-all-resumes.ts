
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminHeader } from '../admin-header/admin-header';

@Component({
  selector: 'app-check-all-resumes',
  imports:[CommonModule,FormsModule,ReactiveFormsModule,RouterLink, AdminHeader],
  templateUrl: './check-all-resumes.html',
  styleUrls: ['./check-all-resumes.scss']
})
export class CheckAllResumesComponent implements OnInit {
  candidates: any[] = [];
  noCandidates = false;
  errorMsg = '';
  loading: boolean = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.adminService.getAllCandidatesForResume().subscribe({
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

  downloadResume(candidate: any): void {
    this.adminService.downloadResume(candidate.candidateId).subscribe({
      next: (pdfBlob: Blob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${candidate.name}_Resume.pdf`;
        a.click();
      },
      error: () => {
        this.errorMsg = 'Resume not found or download failed.';
      }
    });
  }
}
