import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-check',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-check.html',
  styleUrls: ['./role-check.scss']
})
export class RoleCheck {
  interviewerId: number | null = null;
  message: string = '';
  apiUrl: string = 'http://localhost:5152/api/role-check'; // ✅ Update if your API runs on a different port

  constructor(private http: HttpClient) {}

  onCheckRole() {
    if (!this.interviewerId) {
      this.message = 'Please enter a valid interviewer ID.';
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get<string>(`${this.apiUrl}/${this.interviewerId}`, { headers }).subscribe({
      next: (response) => {
        this.message = response;
        console.log('Role Check Response:', response);
      },
      error: (err) => {
        this.message = 'Error: ' + (err.error || 'Unable to check role.');
        console.error(err);
      }
    });
  }
}