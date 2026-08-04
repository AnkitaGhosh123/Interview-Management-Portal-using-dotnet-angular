
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../service/service';
import { AdminHeader } from '../admin-header/admin-header';

@Component({
  selector: 'app-offer-letter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AdminHeader],
  templateUrl: './generate-offer.html',
  styleUrls: ['./generate-offer.scss']
})
export class OfferLetter implements OnInit {
  offerForm!: FormGroup;
  successMsg = '';
  errorMsg = '';

  constructor(private fb: FormBuilder, private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    const candidateId = history.state.candidateId;
    const candidateName = history.state.candidateName;

    this.offerForm = this.fb.group({
      candidateId: [candidateId, Validators.required],
      candidateName: [candidateName, Validators.required],
      position: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1000)]]
    });
  }

  onSubmit(): void {
    if (this.offerForm.invalid) {
      this.errorMsg = 'Please fill all fields correctly.';
      return;
    }

    const payload = this.offerForm.value;

    this.adminService.generateOfferLetter(payload).subscribe({
      next: (pdfBlob: Blob) => {
        this.successMsg = 'Offer generated successfully!';
        this.errorMsg = '';

        // Download PDF
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${payload.candidateId}.pdf`;
        a.click();

        // Navigate back to eligible candidates page
        setTimeout(() => {
          this.router.navigate(['/get-eligible-candidates'], { replaceUrl: true });
        }, 3000);
      },

      error: (err: any) => {
        if (typeof err.error === 'string') {
          this.errorMsg = err.error;
        } else if (err.error?.message) {
          this.errorMsg = err.error.message;
        } else {
          this.errorMsg = 'Something went wrong';
        }
      }

    });
  }
}
