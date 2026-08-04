import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";

interface TeamMember {
  name: string;
  role: string;
 // optional image path
}
@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements OnInit {
  year: number = new Date().getFullYear();

  // Dynamic team data (bind with *ngFor in HTML)
  team: TeamMember[] = [
    {
      name: 'Mousumi Dey',
      role: 'Graduate Apprentice'
    },
    {
      name: 'Ankita Ghosh',
      role: 'Graduate Apprentice'
    },
    {
      name: 'Priyanka Rakshit',
      role: 'Graduate Apprentice'
    },
    // Add more members as needed
  ];

  constructor() {}

  ngOnInit(): void {
    // Any initialization logic can go here
    // Example: fetch team data from API if needed
  }
}
