
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Person {
  name: string;
  email: string;
  position: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class Contact {
[x: string]: any;
  people: Person[] = [
    { name: 'Mousumi Dey', email: 'mousumi.dey@LTIMindtree.com', position: 'Graduate Apprentice' },
    { name: 'Ankita Ghosh', email: 'ankita.ghosh@LTIMindtree.com', position: 'Graduate Apprentice' },
    { name: 'Priyanka Rakshit', email: 'priyanka.rakshit@LTIMindtree.com', position: 'Graduate Apprentice' },
  ];

  // Helper for mailto params
  encode(value: string): string {
    return encodeURIComponent(value ?? '');
  }
}
