
// rejected-candidates.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../service/service';
import { Router, RouterLink } from '@angular/router';
import { AdminHeader } from '../admin-header/admin-header';

interface Candidate {
  id?: number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  // add other candidate fields if needed
}

interface Interview {
  id?: number;
  result?: string;
  interviewDate?: string;
  scheduledOn?: string;
  candidate?: Candidate;
  // add other interview fields if needed
}

@Component({
  selector: 'app-rejected-candidates',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminHeader],
  templateUrl: './rejected-candidates.html',
  styleUrls: ['./rejected-candidates.scss']
})
export class RejectedCandidatesComponent implements OnInit {
  loading: boolean = false;
  errorMessage = '';
  successMessage = '';

  rejectedCount = 0;
  candidates: Interview[] = [];

  // Optional client-side filter (name/email) without changing the API
  searchText = '';

  constructor(private adminService: AdminService,private router: Router) {}

  ngOnInit(): void {
    this.fetchRejectedCandidates();
  }

  
fetchRejectedCandidates(): void {
  this.loading = true;
  this.errorMessage = '';
  this.adminService.getRejectedCandidates().subscribe({
    next: (res: any) => {
      // Use lower camelCase keys from backend
      this.rejectedCount = res?.noOfRejectedCandidates ?? 0;
      this.candidates = Array.isArray(res?.candidates) ? res.candidates : [];
      this.loading = false;
    },
    error: () => {
      this.errorMessage = 'Failed to load rejected candidates.';
      this.loading = false;
    }
  });
}


  refresh(): void {
    this.searchText = '';
    this.fetchRejectedCandidates();
  }

  // Utilities for safe rendering
  getCandidateName(c: Candidate | undefined): string {
    if (!c) return '—';
    const full = [c.firstName, c.lastName].filter(Boolean).join(' ').trim();
    return full || c.name || '—';
  }

  getCandidateEmail(c: Candidate | undefined): string {
    return c?.email || '—';
  }

  // getCandidatePhone(c: Candidate | undefined): string {
  //   return c?.phone || '—';
  // }

  
getInterviewDate(i: Interview | undefined): string {
  if (!i) return '—';
  // interviewCompletedAt is on Candidate in your payload
  const completed = i.candidate && (i.candidate as any).interviewCompletedAt;
  const scheduled = (i as any).scheduledAt || i.scheduledOn || i.interviewDate;
  const created = (i as any).createdAt;

  const chosen = completed || scheduled || created;
  if (!chosen) return '—';

  const d = new Date(chosen);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString(); // only date
}


  // Basic client-side filter by name/email/phone
  get filteredCandidates(): Interview[] {
    const q = this.searchText.trim().toLowerCase();
    if (!q) return this.candidates;
    return this.candidates.filter(i => {
      const name = this.getCandidateName(i.candidate).toLowerCase();
      const email = this.getCandidateEmail(i.candidate).toLowerCase();
      // const phone = this.getCandidatePhone(i.candidate).toLowerCase();
      // return name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }

  trackByIndex(index: number): number {
    return index;
  }
}