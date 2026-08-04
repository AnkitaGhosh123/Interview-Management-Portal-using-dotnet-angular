
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header';

// ---- Optional: tidy types to keep data organized ----
interface UserSummary {
  userName: string;
  level: string;
  skillSet: string[];
}

interface StatsSummary {
  completed: number;
  pending: number;
  upcoming: number;
}

interface QuickAction {
  label: string;
  path: string;
  icon?: string;       // e.g., 'fas fa-user' if you load Font Awesome
  highlight?: boolean; // if you want to emphasize one action
}

@Component({
  selector: 'app-interviewer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, HeaderComponent],
  templateUrl: './interviewer-dashboard.html',
  styleUrls: ['./interviewer-dashboard.scss'], // ✅ use styleUrls (array)
})
export class InterviewerDashboard implements OnInit, OnDestroy {
  // ===== Static user (no backend) =====
  user: UserSummary = {
    userName: 'Interviewer',
    level: 'Senior',
    skillSet: ['Java', 'Angular', 'SQL'],
  };
  isDarkMode = true;

  // ===== Static stats (no backend) =====
  stats: StatsSummary = {
    completed: 12,
    pending: 3,
    upcoming: 5,
  };

  // Animated counters for visual interest (optional)
  animatedStats: StatsSummary = { completed: 0, pending: 0, upcoming: 0 };

  // ===== Actions rendered in your button grid =====
  actions: QuickAction[] = [
    { label: 'Profile', path: '/profile', icon: 'fas fa-user' },
    { label: 'Feedback', path: '/see-all-feedback', icon: 'fas fa-comments' },
    { label: 'Assigned Candidates', path: '/assigned-candidates', icon: 'fas fa-users' },
    { label: 'Update Profile', path: '/update-profile', icon: 'fas fa-edit' },
    { label: 'Give Decision', path: '/decision', icon: 'fas fa-check-circle', highlight: true },
    { label: 'Mark Complete', path: '/completed-interview', icon: 'fas fa-clipboard-check' },
  ];

  // ===== UI state & effects =====
  enableHeaderAnimation = true; // If you used the scanline CSS
  private timers: Array<ReturnType<typeof setInterval>> = [];
userName: any;
level: any;
skillSet: any;
completedCount: any;
pendingCount: any;
upcomingCount: any;

  constructor(private router: Router) {}

  // ---- Lifecycle ----
  ngOnInit(): void {
    // Animate counters once on init
    this.animateStatsCountUp(this.stats, 800);

    // Optional: rotate which action is highlighted every few seconds
    // this.startActionHighlightRotation(3000);
  }

  ngOnDestroy(): void {
    // Clear any timers we created
    this.timers.forEach(t => clearInterval(t));
    this.timers = [];
  }

  // ---- Navigation ----
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  // ---- Visual helpers (no backend) ----
  private animateStatsCountUp(target: StatsSummary, durationMs = 1000): void {
    const fps = 60;
    const steps = Math.max(1, Math.round((durationMs / 1000) * fps));
    let step = 0;

    const start: StatsSummary = { completed: 0, pending: 0, upcoming: 0 };
    const timer = setInterval(() => {
      step++;
      const t = Math.min(1, step / steps);
      const eased = 1 - Math.pow(1 - t, 2); // ease-out

      this.animatedStats.completed = Math.round(start.completed + (target.completed - start.completed) * eased);
      this.animatedStats.pending   = Math.round(start.pending   + (target.pending   - start.pending)   * eased);
      this.animatedStats.upcoming  = Math.round(start.upcoming  + (target.upcoming  - start.upcoming)  * eased);

      if (step >= steps) {
        clearInterval(timer);
      }
    }, 1000 / fps);

    this.timers.push(timer);
  }

  private startActionHighlightRotation(intervalMs = 3000): void {
    let index = this.actions.findIndex(a => a.highlight);
    const timer = setInterval(() => {
      if (index >= 0) this.actions[index].highlight = false;
      index = (index + 1) % this.actions.length;
      this.actions[index].highlight = true;
    }, intervalMs);
    this.timers.push(timer);
  }

}
