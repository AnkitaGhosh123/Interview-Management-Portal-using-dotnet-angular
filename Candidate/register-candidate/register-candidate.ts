
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidate-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls:['./register-candidate.scss'],
  templateUrl: './register-candidate.html',
})
export class CandidateRegister {

  registerForm: FormGroup;
  errorMsg: string = "";
  successMsg: string = "";
  resumeUrl: string = "";

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      skillset: ['', Validators.required],
      totalYearsOfExperience: ['', Validators.required],
      recentEducation: [''],
      universityName: [''],
      averageCGPA: [''],
      projects: this.fb.array([]),
      internships: this.fb.array([])
    });
  }

  get projects() {
    return this.registerForm.get('projects') as FormArray;
  }

  get internships() {
    return this.registerForm.get('internships') as FormArray;
  }

  addProject() {
    this.projects.push(this.fb.control(''));
  }

  addInternship() {
    this.internships.push(this.fb.control(''));
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMsg = "Fill all required fields";
      return;
    }

    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.errorMsg = "Passwords do not match";
      return;
    }

    const formData = this.registerForm.value;

    // ✅ No Authorization header needed because endpoint is AllowAnonymous
    this.http.post("http://localhost:5152/api/Candidate/register", formData)
      .subscribe({
        next: (res: any) => {
          this.successMsg = "Registration successful!";
          this.errorMsg = "";
          this.resumeUrl = res.resumeDownloadUrl;
        },
        error: (err) => {
          this.errorMsg = err.error || "Something went wrong";
          console.error(err);
        }
      });
  }
}
