
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../candidate-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidate-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './candidate-login.html',
  styleUrls: ['./candidate-login.scss']
})
export class CandidateLogin {
  loginForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private candidateService: CandidateService, public router: Router) {
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

    this.candidateService.loginCandidate(credentials).subscribe({
      next: (res) => {
        if (res.status === 'newCandidate') {
          this.errorMessage = 'New user!! First create your account.';
          this.successMessage = '';
          setTimeout(() => {
            this.router.navigate(['/register-candidate']);
          }, 3000);
          return;
        }

        if (res.status === 'invalidCredentials') {
          this.errorMessage = 'Invalid email ID or password.';
          return;
        }

        // ✅ Successful login
        this.successMessage = 'Login successful!';
        this.errorMessage = '';

        // ✅ Store token in unified key
        localStorage.setItem('token', res.token);
        localStorage.setItem('candidateId', res.candidateId.toString());
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('interviewStatus', res.interviewStatus);

        this.loginForm.reset();
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMessage = 'Invalid email ID or password.';
      }
    });
  }
}
