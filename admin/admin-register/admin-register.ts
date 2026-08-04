
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../service/service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin-register',
  imports:[CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './admin-register.html',
  styleUrls: ['./admin-register.scss']
})
export class AdminRegister {
  registerForm: FormGroup;
  isSubmitted = false;

  constructor(private fb: FormBuilder, private adminService: AdminService) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const dto = {
        fullName: this.registerForm.value.fullName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        confirmPassword: this.registerForm.value.confirmPassword,
        role: 'Admin'
      };

      this.adminService.registerAdmin(dto).subscribe({
        next: () => this.isSubmitted = true,
        error: (err: { error: any; }) => alert(err.error || 'Registration failed')
      });
    }
  }
}