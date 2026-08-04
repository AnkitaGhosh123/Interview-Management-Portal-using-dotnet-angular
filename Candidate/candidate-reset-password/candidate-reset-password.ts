import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../candidate-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './candidate-reset-password.html',
  styleUrls: ['./candidate-reset-password.scss']
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private candidateService: CandidateService, private router: Router) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required]] // ✅ Removed pattern & minlength for enabling button
    });
  }

  // ✅ Password strength indicator logic
  getPasswordStrength(): string {
    const pwd = this.resetForm.get('newPassword')?.value || '';
    if (!pwd) return ''; // Hide indicator if empty
    if (pwd.length < 6) return 'weak';
    if (/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(pwd)) return 'strong';
    return 'moderate';
  }

  // ✅ Reset password API call
  onResetPassword() {
    if (!this.resetForm.get('email')?.value || !this.resetForm.get('newPassword')?.value) {
      this.errorMessage = 'Please fill both fields.';
      return;
    }

    const resetData = this.resetForm.value;

    this.candidateService.resetPassword(resetData).subscribe({
      next: () => {
        this.successMessage = 'Password reset successful! Please login.';
        this.errorMessage = '';
        setTimeout(() => {
          this.router.navigate(['/candidate-login']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error || 'Failed to reset password. Check email.';
      }
    });
  }
}
