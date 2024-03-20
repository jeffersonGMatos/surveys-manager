import { Component, Input } from "@angular/core";
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
import { Question } from "./question";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-cad-questions",
  templateUrl: 'cad-question.component.html',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  styleUrls: ['../screen.css', 'cad-question.component.css'],
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
export class CadQuestionComponent {
  @Input() surveyId!: string;
  
  isLoading = true;
  questionsForm = new FormArray<FormGroup>([], Validators.minLength(1))

  constructor(
    private surveyService: SurveysService,
    private route: ActivatedRoute
  ) {}

  /*
  private saveQuestion() {
    const value = this.surveyForm.value;

    if (!value.surveyId)
      this.surveyService.createSurvey(value as Survey);
  }
  */

  getQuestions() {
    this.surveyService
      .getQuestions(this.surveyId)
      .subscribe(data => data.forEach(item => this.addQuestion(item)));
  }

  addQuestion(question: Question) {
    console.log(63, question);
    this.questionsForm.push(
      new FormGroup({
        questionId: new FormControl<string | null>(question.questionId),
        description: new FormControl<string>(question.description, [Validators.required, Validators.maxLength(255)]),
        selectionNumber: new FormControl<number>(question.selectionNumber, [Validators.required, Validators.min(1)]),
        surveyId: new FormControl<string>(question.surveyId, [Validators.required]),
        question: new FormArray<FormControl>([])
      })
    )    
  }

  removeQuestion(index: number) {
    //this.questions.removeAt(index)   
  }

  async onClickAddQuestion() {
    const question = await firstValueFrom(
      this.surveyService.createQuestion({
        description: '',
        selectionNumber: 1,
        surveyId: this.surveyId,
        questionId: null
      })
    );

    if (question)
      this.addQuestion(question);
  }

  onSubmit(ev: SubmitEvent) {
    ev.preventDefault();
    /*
    if (this.surveyForm.valid)
      this.saveSurvey()
    else {
      this.surveyForm.markAllAsTouched();
      this.questions.controls.forEach(item => item.markAllAsTouched())
    }
    */
  }

  ngOnInit() {
    this.getQuestions()
  }

}