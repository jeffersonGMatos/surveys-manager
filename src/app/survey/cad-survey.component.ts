import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatDividerModule } from "@angular/material/divider";
import { SurveysService } from "../home/surveys.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { provideNativeDateAdapter } from "@angular/material/core";
import { DatePipe } from "@angular/common";
import { Survey } from "../home/survey";
import { firstValueFrom } from "rxjs";
import { CadQuestionComponent } from "../questions/cad-question.component";

@Component({
  templateUrl: 'cad-survey.component.html',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  styleUrls: ['../screen.css', 'cad-survey.component.css'],
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatCardModule,
    DatePipe,
    MatDividerModule,
    CadQuestionComponent
  ]
})
export class CadSurveyComponent {
  isLoading = true;
  
  surveyForm = new FormGroup({
    surveyId: new FormControl<string | null>(null),
    name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    expirationDate: new FormControl<Date>(new Date(), Validators.required)
  })

  get expirationDate(): FormControl<Date> {
    return this.surveyForm.get('expirationDate') as FormControl<Date>
  }

  get name(): FormControl<string> {
    return this.surveyForm.get('name') as FormControl<string>
  }

  get surveyId(): FormControl {
    return this.surveyForm.get('surveyId') as FormControl
  }

  constructor(
    private surveyService: SurveysService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  private async getSurvey(surveyId: string) {
    const survey = await firstValueFrom(this.surveyService.getSurvey(surveyId))
    if (survey)
      this.setSurveyFormValue(survey);
  }

  private setSurveyFormValue(survey: Survey) {
    this.surveyForm.reset({
      surveyId: survey.surveyId,
      name: survey.name,
      expirationDate: survey.expirationDate
    });

    this.isLoading = false;
  }

  private async updateSurvey(value: Survey) {
    let response = await firstValueFrom(this.surveyService.updateSurvey(value as Survey))
    if (response)
      this.router.navigate([`surveys/${response.surveyId}`], {onSameUrlNavigation: "reload"});
  }

  private async createSurvey(value: Survey) {
    let response = await firstValueFrom(this.surveyService.createSurvey(value))

    if (response)
      this.router.navigate([`surveys/${response.surveyId}`], {onSameUrlNavigation: "reload"});
  }

  private async saveSurvey() {
    const value = this.surveyForm.value;

    if (value.surveyId)
      this.updateSurvey(value as Survey);
    else
      this.createSurvey(value as Survey);
  }

  onSubmit(ev: SubmitEvent) {
    ev.preventDefault();
    
    if (this.surveyForm.valid)
      Promise.resolve(this.saveSurvey())
    else
      this.surveyForm.markAllAsTouched()
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      if (id === 'add')
        this.setSurveyFormValue({
          surveyId: null, 
          expirationDate: new Date(), 
          name: ''
        })
      else
        this.getSurvey(id)

    }
  }

}