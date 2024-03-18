import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatDividerModule } from "@angular/material/divider";
import { SurveysService } from "../home/surveys.service";
import { ActivatedRoute } from "@angular/router";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { provideNativeDateAdapter } from "@angular/material/core";
import { DatePipe } from "@angular/common";
import { Survey } from "../home/survey";

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
    MatDividerModule
  ]
})
export class CadSurveyComponent {
  isLoading = true;
  
  surveyForm = new FormGroup({
    surveyId: new FormControl<string | null>(null),
    name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    expirationDate: new FormControl<Date>(new Date(), Validators.required),
    questions: new FormArray([], Validators.minLength(1))
  })

  get expirationDate(): FormControl<Date> {
    return this.surveyForm.get('expirationDate') as FormControl<Date>
  }

  get name(): FormControl<string> {
    return this.surveyForm.get('name') as FormControl<string>
  }

  get questions(): FormArray<FormGroup> {
    return this.surveyForm.get('questions') as FormArray
  }

  get surveyId(): FormControl {
    return this.surveyForm.get('surveyId') as FormControl
  }

  constructor(
    private surveyService: SurveysService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id === 'add')
      this.addSurvey();
    else
      this.editSurvey()
  }

  private addSurvey() {
    this.surveyForm.reset({
      surveyId: null,
      name: '',
      expirationDate: new Date(),
      questions: []
    });
    this.isLoading = false;
  }

  private editSurvey() {

  }

  private saveSurvey() {
    const value = this.surveyForm.value;

    if (!value.surveyId)
      this.surveyService.createSurvey(value as Survey);
  }

  addQuestion() {
    this.questions.push(
      new FormGroup({
        questionId: new FormControl<string | null>(null),
        description: new FormControl<string>('', [Validators.required, Validators.maxLength(255)]),
        selectionNumber: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
        responses: new FormArray<FormGroup>([], Validators.minLength(1))
      })
    )    
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index)   
  }

  removeOption(controls: FormArray, index: number) {
    controls.removeAt(index);
  }

  asFormArray(control: any) {
    return control as FormArray
  }

  asFormControl(control: any) {
    return control as FormControl
  }

  addResponse(control: FormArray) {
    if (control)
      control.push(
        new FormGroup({
          optionId: new FormControl<string | null>(null),
          description: new FormControl('', [Validators.required, Validators.maxLength(255)])
        })
      )
  }

  onSubmit(ev: SubmitEvent) {
    ev.preventDefault();
    
    if (this.surveyForm.valid)
      this.saveSurvey()
    else {
      this.surveyForm.markAllAsTouched();
      this.questions.controls.forEach(item => item.markAllAsTouched())
    }
  }

}