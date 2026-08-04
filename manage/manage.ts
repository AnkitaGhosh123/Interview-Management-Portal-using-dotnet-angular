import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage',
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './manage.html',
  styleUrl: './manage.scss',
})
export class Manage {

}
