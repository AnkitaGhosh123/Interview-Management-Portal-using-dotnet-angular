import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-superadmin-header',
  imports: [CommonModule,RouterLink,FormsModule,ReactiveFormsModule],
  templateUrl: './superadmin-header.html',
  styleUrl: './superadmin-header.scss',
})
export class SuperadminHeader {
  constructor(private router: Router) { }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']); // or admin-home if needed
  }
}
