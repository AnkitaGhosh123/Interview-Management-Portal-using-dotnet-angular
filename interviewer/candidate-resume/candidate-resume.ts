import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidate-resume',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './candidate-resume.html',
  styleUrls: ['./candidate-resume.scss']
})
export class CandidateResume {
  candidateId: number | null = null;
  message: string = '';
  apiUrl: string = 'http://localhost:5152/api/candidate'; // ✅ Adjust base URL if needed

  constructor(private http: HttpClient) {}

  downloadResume() {
    if (!this.candidateId) {
      this.message = 'Please enter a valid Candidate ID.';
      return;
    }

    const url = `${this.apiUrl}/${this.candidateId}/resume`;

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const fileName = `Candidate_${this.candidateId}_Resume.pdf`; // ✅ Default name
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        this.message = 'Resume downloaded successfully!';
      },
      error: (err) => {
        this.message = 'Failed to download resume: ' + (err.error || 'Not found');
        console.error(err);
      }
    });
  }
}