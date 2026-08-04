
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({

  selector: 'app-header',
  standalone: true, // ✅ Make it standalone
  imports: [RouterModule], // ✅ For routerLink to work
  templateUrl: './header.html',
  styleUrls: ['./header.scss']

})
export class HeaderComponent {
  constructor(private router: Router) { }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/interviewer']); // or admin-home if needed
  }
}
