import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { SurveysService } from "./surveys.service";
import { Survey } from "./survey";
import { Router } from "@angular/router";
import { firstValueFrom } from 'rxjs';
import { AppService } from "../app.service";

@Component({
  standalone: true,
  imports: [
    MatIconModule,
    MatTableModule,
    DatePipe,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['../screen.css']
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['name', 'expirationDate', 'isActive', 'surveyId'];
  data: Survey[] = [];
  isSearching = false;

  constructor(
    private surveysService: SurveysService,
    private router: Router
  ) {}

  showSurvey(id: string) {
    this.router.navigate([`surveys/${id}`])
  }

  showReport(id: string) {
    this.router.navigate([`reports/${id}`])
  }

  async getSurveys() {
    this.data = await firstValueFrom(this.surveysService.getSurveys());
  }

  ngOnInit() {
    Promise.resolve(this.getSurveys());
  }
}