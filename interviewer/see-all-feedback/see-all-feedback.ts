
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterviewerService } from '../interviewer-service';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header';

@Component({
  selector: 'app-see-all-feedback',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './see-all-feedback.html',
  styleUrls: ['./see-all-feedback.scss']
})
export class SeeAllFeedback implements OnInit {
  feedbackData: any = null;
  message: string = '';
  loading: boolean = false;
  constructor(private interviewerService: InterviewerService) {}

  ngOnInit() {
    const interviewerId = localStorage.getItem('interviewerId');
    if (interviewerId) {
      this.loadFeedback(parseInt(interviewerId));
    } else {
      this.message = 'User not logged in.';
    }
  }

  loadFeedback(id: number) {
    this.interviewerService.getFeedback(id).subscribe({
      next: (data: any) => {
        this.feedbackData = data;
        this.message = data.message || '';
      },
      error: (err: any) => {
        this.message = err.error?.message || 'Failed to load feedback.';
        console.error(err);
      }
    });
  }
}
