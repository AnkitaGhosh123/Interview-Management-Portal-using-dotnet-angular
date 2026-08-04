
// offer-rejected.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../service/service';
import { RouterLink } from '@angular/router';
import { AdminHeader } from '../admin-header/admin-header';

interface Candidate {
  id?: number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  // add any other fields if needed
}

interface Interview {
  id?: number;
  status?: string;        // Expect "OfferRejected"
  result?: string;        // Optional
  interviewDate?: string; // ISO or date string from backend
  scheduledOn?: string;   // Optional alternate date field
  candidate?: Candidate;
  // add any other fields if needed
}

@Component({
  selector: 'app-offer-rejected',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminHeader],
  templateUrl: './offer-rejected.html',
  styleUrls: ['./offer-rejected.scss']
})
export class OfferRejectedComponent implements OnInit {
  loading: boolean = false;
  errorMessage = '';
  successMessage = '';

  count = 0;
  candidates: Interview[] = [];

  // Optional client-side search
  searchText = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchOfferRejected();
  }

  
fetchOfferRejected(): void {
  this.loading = true;
  this.errorMessage = '';
  this.adminService.getOfferRejected().subscribe({
    next: (res: any) => {
      // Use lower camelCase keys from backend
      this.count = res?.count ?? 0;
      this.candidates = Array.isArray(res?.candidates) ? res.candidates : [];
      this.loading = false;
    },
    error: () => {
      this.errorMessage = 'Failed to load offer-rejected candidates.';
      this.loading = false;
    }
  });
}

  refresh(): void {
    this.searchText = '';
    this.fetchOfferRejected();
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

  getCandidatePhone(c: Candidate | undefined): string {
    return c?.phone || '—';
  }

  
getInterviewDate(i: Interview | undefined): string {
  if (!i) return '—';
  // completion time on Candidate
  const completed = i.candidate && (i.candidate as any).interviewCompletedAt;
  const scheduled = (i as any).scheduledAt || i.scheduledOn || i.interviewDate;
  const created = (i as any).createdAt;

  const chosen = completed || scheduled || created;
  if (!chosen) return '—';

  const d = new Date(chosen);
  // Only date (no time)
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
}

  // Client-side filter by name/email/phone
  get filteredCandidates(): Interview[] {
    const q = this.searchText.trim().toLowerCase();
    if (!q) return this.candidates;
    return this.candidates.filter(i => {
      const name = this.getCandidateName(i.candidate).toLowerCase();
      const email = this.getCandidateEmail(i.candidate).toLowerCase();
      const phone = this.getCandidatePhone(i.candidate).toLowerCase();
      return name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }

  trackByIndex(index: number): number {
    return index;
  }
}
