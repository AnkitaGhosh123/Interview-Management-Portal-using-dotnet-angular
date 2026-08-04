
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  roles = ['SuperAdmin', 'Admin', 'Interviewer', 'Candidate'];
  selectedRole: string = '';
  showTutorial: boolean = false;

  constructor(private router: Router) {}

  navigate() {
    if (this.selectedRole === 'SuperAdmin') {
      this.router.navigate(['/superadmin-login']);
    } else if (this.selectedRole === 'Admin') {
      this.router.navigate(['/admin']);
    } else if (this.selectedRole === 'Candidate') {
      this.router.navigate(['/candidate']);
    } else if (this.selectedRole === 'Interviewer') {
      this.router.navigate(['/interviewer']);
    }
  }

  goManage() {
    this.router.navigate(['/manage']);
  }

  goUse() {
    this.router.navigate(['/use']);
  }

  skipTutorial() {
    this.showTutorial = false;
  }
}
