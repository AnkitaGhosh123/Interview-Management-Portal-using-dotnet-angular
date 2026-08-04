
import { Component } from '@angular/core';
import { SuperadminService } from '../superadmin-service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-superadmin-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './superadmin-login.html',
  styleUrls: ['./superadmin-login.scss']
})
export class SuperAdminLogin {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoggedIn: boolean = false;
  token: string = '';
  user: any;

  constructor(private superadminService: SuperadminService, private router: Router) {}

  login() {
    this.superadminService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.isLoggedIn = true;
        this.errorMessage = '';
        this.token = res.token;
        this.user = res.user;

        // ✅ Store token in unified key
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));

        this.router.navigate(['/superadmin-dashboard']);
      },
      error: (err:any) => {
        this.errorMessage = err.error.message || 'Login failed. Please try again.';
      }
    });
  }
}