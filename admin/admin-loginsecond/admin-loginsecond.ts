
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../service/service';


@Component({
  selector: 'app-admin-second-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-loginsecond.html',
  styleUrls: ['./admin-loginsecond.scss']
})
export class AdminSecondLoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private adminService: AdminService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      secretKey: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter valid credentials.';
      return;
    }

    const credentials = this.loginForm.value;

    this.adminService.secondLogin(credentials).subscribe({
      next: (res:any) => {
        this.successMessage = 'Login successful!';
        this.errorMessage = '';

        // ✅ Store token and user info for authentication
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.user.userId.toString());
        localStorage.setItem('user', JSON.stringify(res.user));

        this.loginForm.reset();

        // ✅ Navigate to Admin Dashboard
        this.router.navigate(['/admin-dashboard']);
      },
      error: (err:any) => {
        this.errorMessage = 'Invalid password or secret key';
        this.successMessage = '';
      }
    });
  }
}
