import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-candidate-header',
  imports: [RouterLink,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './candidate-header.html',
  styleUrl: './candidate-header.scss',
})
export class CandidateHeader {
   constructor(private router: Router) { }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/candidate']); 
  }
}
