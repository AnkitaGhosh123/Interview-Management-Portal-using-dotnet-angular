
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InterviewerService } from '../interviewer-service';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent],
  templateUrl: './update-profile.html',
  styleUrls: ['./update-profile.scss']
})
export class UpdateProfile implements OnInit {
  interviewerId: number = 0;
  profile: any = {
    fullName: '',
    email: '',
    password: '',
    skillSet: '',
    yearsOfExperience: 0,
    level: '',
    interviewType: '',
    isAvailable: true,
    joinedAt: ''
  };
  message: string = '';
  loading: boolean = false;
  constructor(private interviewerService: InterviewerService, private router: Router) {}

  ngOnInit() {
    const interviewerId = localStorage.getItem('interviewerId'); // ✅ Use interviewerId
    if (interviewerId) {
      this.interviewerId = parseInt(interviewerId);
      this.loadProfile();
    } else {
      this.message = 'User not logged in.';
    }
  }

  loadProfile() {
    this.interviewerService.getProfile(this.interviewerId).subscribe({
      next: (data: any) => {
        this.profile = { ...data, password: '' }; // ✅ Password blank initially
      },
      error: () => {
        this.message = 'Failed to load profile.';
      }
    });
  }

  updateProfile() {
    if (!this.profile.password || this.profile.password.trim() === '') {
      this.message = 'Password is required to update profile.';
      return;
    }

    const payload = {
      FullName: this.profile.fullName,
      Email: this.profile.email,
      Password: this.profile.password, // ✅ Always send password
      SkillSet: this.profile.skillSet,
      YearsOfExperience: this.profile.yearsOfExperience,
      Level: this.profile.level,
      InterviewType: this.profile.interviewType,
      IsAvailable: this.profile.isAvailable,
      JoinedAt: this.profile.joinedAt
    };

    this.interviewerService.updateProfile(this.interviewerId, payload).subscribe({
      next: (response: any) => {
        
this.message = response.message || 'Profile updated successfully';
        setTimeout(() => {
          this.router.navigate(['/interviewer-dashboard']); // ✅ Redirect after success
        }, 1500);
      },

      error: (err: any) => {
        console.error('Update error:', err);
        this.message = 'Update failed: ' + (err.error || 'Error occurred');
      }
    });
  }
}
