import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly user$

  constructor(
    appService: AppService,
    private router: Router
  ) {
    this.user$ = appService.user.asObservable()
    this.user$.subscribe(v => console.log(v))
  }

  public showUsers() {
    this.router.navigate(['users']);
  }

  public showSurveys() {
    this.router.navigate(['']);
  }

}
