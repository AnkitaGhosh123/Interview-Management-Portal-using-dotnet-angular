
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-interviewer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterInterviewerComponent {
  registerForm: FormGroup;
  isSubmitted = false;
  apiUrl = 'http://localhost:5152/api/Interviewer/register-interviewer'; // Ensure this matches your backend route

  levels = ['L1', 'L2'];
  interviewTypes = ['Technical', 'HR', 'Managerial'];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      fullName: this.fb.control<string>('', { validators: [Validators.required] }),
      email: this.fb.control<string>('', { validators: [Validators.required, Validators.email] }),
      password: this.fb.control<string>('', { validators: [Validators.required, Validators.minLength(6)] }),
      confirmPassword: this.fb.control<string>('', { validators: [Validators.required] }),
      skillSet: this.fb.control<string>('', { validators: [Validators.required] }),
      level: this.fb.control<string>('', { validators: [Validators.required] }),
      yearsOfExperience: this.fb.control<number>(0, { validators: [Validators.required, Validators.min(0), Validators.max(50)] }),
      interviewType: this.fb.control<string>('', { validators: [Validators.required] }),
      isAvailable: this.fb.control<boolean>(false)
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator for password match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.http.post<any>(this.apiUrl, this.registerForm.value).subscribe({
        next: (res) => {
          this.isSubmitted = true;
          console.log('Registration successful:', res);
        },
        error: (err) => {
          console.error('Registration failed:', err);
        }
      });
    }
  }
}
