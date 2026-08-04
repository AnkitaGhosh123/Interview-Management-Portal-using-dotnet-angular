
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../service/service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminHeader } from '../admin-header/admin-header';

@Component({
  selector: 'app-assign-interviewer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, AdminHeader],
  templateUrl: './assign-interviewer.html',
  styleUrls: ['./assign-interviewer.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AssignInterviewerComponent implements OnInit {
  selectedCandidate: any;
  interviewers: any[] = [];
  selectedInterviewer: any;
  selectedDate: string = '';

  constructor(private adminService: AdminService, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.selectedCandidate = nav?.extras.state?.['candidate'];
  }

  ngOnInit() {
    if (this.selectedCandidate) {
      this.adminService.getSuitableInterviewers(this.selectedCandidate.candidateId).subscribe((res: any) => {
        console.log('Interviewers Response:', res);
        this.interviewers = Array.isArray(res) ? res : res.data || [];
      });
    }
  }

  assign() {
    if (!this.selectedInterviewer || !this.selectedDate) {
      alert('Please select an interviewer and date.');
      return;
    }

    const payload = {
      interviewerId: this.selectedInterviewer.id,
      candidateId: this.selectedCandidate.candidateId,
      scheduledDate: this.selectedDate
    };

    this.adminService.assignInterviewer(payload).subscribe((res: any) => {
      alert(res.message);

      // ✅ Navigate back and refresh candidate list
      this.router.navigate(['/candidate-list'], { state: { refresh: true } });
    });
  }

  // ✅ Back button method
  goBack() {
    this.router.navigate(['/candidate-list']);
  }
}
