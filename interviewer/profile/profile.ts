
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterviewerService } from '../interviewer-service';
import { HeaderComponent } from '../header/header';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-interviewer-profile',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class InterviewerProfile implements OnInit {
  profile: any = null;
  message: string = '';
  loading: boolean = false;
  constructor(private interviewerService: InterviewerService) {}

  ngOnInit() {
    const interviewerId = localStorage.getItem('interviewerId');
    if (interviewerId) {
      this.loadProfile(parseInt(interviewerId));
    } else {
      this.message = 'User not logged in.';
    }
  }

  loadProfile(id: number) {
    this.interviewerService.getProfile(id).subscribe({
      next: (data:any) => {
        this.profile = data;
        this.message = '';
      },
      error: (err:any) => {
        this.message = err.error?.message || 'Failed to load profile.';
        console.error(err);
      }
    });
  }
}
