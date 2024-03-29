import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { UsersService } from "./users.service";
import { User, UserRoles, userRolesDescription } from "./user";
import { Router } from "@angular/router";
import { firstValueFrom, Observable } from 'rxjs';
import { AppService } from "../app.service";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['../screen.css']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'username', 'profile', 'userId'];
  data: User[] = [];
  isSearching = true;
  
  readonly userRolesDescription: any = userRolesDescription
  readonly UserRoles = UserRoles
  readonly user$: Observable<User | null>

  constructor(
    appService: AppService,
    private usersService: UsersService,
    private router: Router
  ) {
    this.user$ = appService.user.asObservable();
    this.user$.subscribe(v => console.log(v))
  }

  showUser(id: string) {
    this.router.navigate([`users/${id}`])
  }

  async getUsers() {
    this.data = await firstValueFrom(this.usersService.getUsers());
    this.isSearching = false;
  }

  ngOnInit() {
    Promise.resolve(this.getUsers());
  }
}