import { ChangeDetectorRef, Component, ElementRef, ViewChild } from "@angular/core";
import { SurveysService } from "../home/surveys.service";
import { ActivatedRoute, Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatRadioModule } from "@angular/material/radio";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Survey } from "../home/survey";
import { CommonModule } from "@angular/common";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  templateUrl: 'results.component.html',
  styleUrls: ['../screen.css', './results.component.css']
})
export class ResultsComponent {
  @ViewChild('reportTable') reportTable!: ElementRef<HTMLTableElement>;
  public survey?: any;
  public groupByData: any[] = [];
  public groupBy: string | null = null;
  public show: FormControl<number> = new FormControl<number>(0, {nonNullable: true});
  public resultsForm = new FormGroup({
    groupBy: new FormControl<string | null>(null)
  });
  public isLoading = true;


  constructor(
    private surveysService: SurveysService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.cdr.detach();
  }

  private async getReports() {
    this.isLoading = true;
    this.cdr.detectChanges();
    const surveyId = this.route.snapshot.paramMap.get('id');

    if (surveyId) {
      this.groupBy = (this.resultsForm.get('groupBy') as FormControl<string | null>).value;
      this.survey = await firstValueFrom(this.surveysService.getReport(surveyId, this.resultsForm.value));
      console.log(this.groupBy, this.survey);
    }

    this.isLoading = false;
    this.cdr.detectChanges();
  }

  public getGroupByData(question: any): string[] {
    return Object.keys(question.options[0].results)
  }

  back() {
    this.router.navigate(['/'])
  }

  onSubmit(ev: SubmitEvent) {
    Promise.resolve(this.getReports());
  }

  ngOnInit() {
    Promise.resolve(this.getReports());

    this.show.valueChanges.subscribe(() => {
      this.cdr.detectChanges();
    })
  }

}