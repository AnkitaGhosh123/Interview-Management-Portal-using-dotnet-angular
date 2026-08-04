import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-use',
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './use.html',
  styleUrl: './use.scss',
})
export class Use {

}
