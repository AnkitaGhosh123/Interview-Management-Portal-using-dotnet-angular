import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { InterviewerService } from '../interviewer-service';
 
@Component({
  selector: 'app-interviewer-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './interviewer-reset-password.html',
  styleUrls: ['./interviewer-reset-password.scss']
})
export class InterviewerResetPassword {
 
  resetForm: FormGroup;
  successMessage = "";
  errorMessage = "";
 
  constructor(
    private fb: FormBuilder,
    private interviewerService: InterviewerService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required]]
    });
  }
 
  getPasswordStrength(): string {
    const pwd = this.resetForm.get('newPassword')?.value;
 
    if (!pwd) return "";
 
    if (/^(?=.*[A-Z])(?=.*\d)(?=.*[@$%*#?&]).{6,}$/.test(pwd)) return 'strong';
    if (/^(?=.*[A-Z])(?=.*\d).{6,}$/.test(pwd)) return 'moderate';
 
    return 'weak';
  }
 
  onResetPassword() {
    if (!this.resetForm.get('email')?.value || !this.resetForm.get('newPassword')?.value) {
      this.errorMessage = 'Please fill both fields.';
      return;
    }
 
    const resetData = this.resetForm.value;
 
    this.interviewerService.resetPassword(resetData).subscribe({
      next: () => {
        this.successMessage = 'Password reset successful! Please login.';
        this.errorMessage = '';
        setTimeout(() => {
          this.router.navigate(['/interviewer-login']);
        }, 1500);
      },
      error: (err:any) => {
        this.errorMessage = err.error || 'Failed to reset password. Check email.';
      }
    });
  }
}
 