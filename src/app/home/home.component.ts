import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { SurveysService } from "./surveys.service";
import { Survey } from "./survey";
import { Router } from "@angular/router";

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
  styleUrls: ['../screen.css', './home.component.css']
})
export class HomeComponent  {
  displayedColumns: string[] = ['description', 'expireAt', 'surveyId'];
  data: Survey[] = [];
  isSearching = false;

  constructor(
    private surveysService: SurveysService,
    private router: Router
  ) {}

  showSurvey(id: string) {
    this.router.navigate([`surveys/${id}`])
  }

  getSurveys() {
    this.surveysService.getSurveys().subscribe(data => this.data = data)
  }
}