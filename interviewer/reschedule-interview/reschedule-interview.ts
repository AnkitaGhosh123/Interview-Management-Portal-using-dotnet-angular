
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InterviewerService } from '../interviewer-service';
import { CommonEngine } from '@angular/ssr/node';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reschedule',
  imports:[CommonModule,FormsModule,ReactiveFormsModule,RouterLink],
  standalone: true,
  templateUrl: './reschedule-interview.html',
  styleUrls: ['./reschedule-interview.scss']
})
export class RescheduleInterview implements OnInit {
  candidateId!: number;
  selectedDate: string = '';
  message: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private interviewerService: InterviewerService) {}

  ngOnInit() {
    this.candidateId = parseInt(this.route.snapshot.paramMap.get('candidateId')!);
  }

  rescheduleInterview() {
    if (!this.selectedDate) {
      this.message = 'Please select a date.';
      return;
    }

    this.interviewerService.rescheduleInterview(this.candidateId, this.selectedDate).subscribe({
      next: (res: any) => {
        this.message = res.message;
        setTimeout(() => this.router.navigate(['/interviewer-dashboard']), 2000);
      },
      error: () => this.message = 'Failed to reschedule interview.'
    });
  }
}
