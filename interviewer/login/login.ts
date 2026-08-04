import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { InterviewerService } from '../interviewer-service';

@Component({
  selector: 'app-interviewer-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class InterviewerLogin {

  loginForm: FormGroup;
  successMessage = "";
  errorMessage = "";

  constructor(
    private fb: FormBuilder,
    private interviewerService: InterviewerService,
    public router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter valid credentials.';
      return;
    }

    const credentials = this.loginForm.value;

    this.interviewerService.loginInterviewer(credentials).subscribe({
      next: (res) => {

        if (res.status === 'newInterviewer') {
          this.errorMessage = 'New user! First create your account.';
          this.successMessage = '';
          setTimeout(() => {
            this.router.navigate(['/register-interviewer']);
          }, 2000);
          return;
        }


        if (res.status === 'pendingApproval') {
          this.errorMessage = 'Your registration request is pending approval or rejection by SuperAdmin. We will notify you. Thank you for your patience.';
          this.successMessage = '';
          return;
        }


        if (res.status === 'invalidCredentials') {
          this.errorMessage = 'Invalid email ID or password.';
          return;
        }

        // Successful login
        this.successMessage = 'Login successful!';
        this.errorMessage = '';

        localStorage.setItem('token', res.token);
        localStorage.setItem('interviewerId', res.interviewerId.toString());
        localStorage.setItem('user', JSON.stringify(res.user));

        this.loginForm.reset();
        this.router.navigate(['/interviewer-dashboard']);
      },

      error: () => {
        this.errorMessage = 'Invalid email ID or password.';
      }
    });
  }
}
