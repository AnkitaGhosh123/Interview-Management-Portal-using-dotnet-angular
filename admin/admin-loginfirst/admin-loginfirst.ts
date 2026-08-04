
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../service/service';


@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './admin-loginfirst.html',
  styleUrls: ['./admin-loginfirst.scss']
})
export class AdminLogin {
  loginForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private adminService: AdminService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      secretKey: ['', [Validators.required]] // ✅ Secret key for Admin
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter valid credentials.';
      return;
    }

    const credentials = this.loginForm.value;

    this.adminService.firstLogin(credentials).subscribe({
      next: (res) => {
        if (res.status === 'pendingApproval') {
          this.errorMessage = 'Your registration request is pending approval or rejection by SuperAdmin. We will notify you. Thank you for your patience.';
          this.successMessage = '';
          return;
        }

        if (res.status === 'newAdmin') {
          this.errorMessage = 'New admin! Please raise a registration request as Admin first.';
          this.successMessage = '';
          setTimeout(() => {
            this.router.navigate(['/register-admin']);
          }, 2000);
          return;
        }

        // Successful login
        this.successMessage = 'Login successful!';
        this.errorMessage = '';

        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.user.userId.toString());
        localStorage.setItem('user', JSON.stringify(res.user));

        this.loginForm.reset();
        this.router.navigate(['/admin-loginsecond']);
      },
      error: () => {
        this.errorMessage = 'Invalid email or password.';
      }
    });
  }
}
