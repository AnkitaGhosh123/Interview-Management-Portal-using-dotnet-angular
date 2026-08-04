
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminHeader } from '../admin-header/admin-header';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminHeader],
  templateUrl: './adminhome.html',
  styleUrls: ['./adminhome.scss']
})
export class AdminHome {
  // No extra logic needed because RouterLink handles navigation
}
