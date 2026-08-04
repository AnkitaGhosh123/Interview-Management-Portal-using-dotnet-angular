import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('interviewportal');
}
