
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonEngine } from '@angular/ssr/node';

@Component({
  selector: 'app-admin-home',
  imports:[CommonModule,FormsModule,ReactiveFormsModule, RouterLink],
  templateUrl: './admin-frontpage.html',
  styleUrls: ['./admin-frontpage.scss']
})
export class AdminFrontPage {}
