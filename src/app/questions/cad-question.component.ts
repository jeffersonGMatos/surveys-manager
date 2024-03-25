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
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { provideNativeDateAdapter } from "@angular/material/core";
import { DatePipe } from "@angular/common";
import { Question } from "./question";
import { debounceTime, distinctUntilChanged, firstValueFrom } from "rxjs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

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
    MatDividerModule,
    MatProgressSpinnerModule
  ]
})
export class CadQuestionComponent {
  @Input() surveyId!: string;
  @Input() questions!: Question[];
  isLoadingQuestionOption = false;
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

  /*
  getQuestions() {
    this.surveyService
      .getQuestions(this.surveyId)
      .subscribe(data => data.forEach(item => this.addQuestion(item)));
  }
  */

  private createFormListener(form: FormGroup) {
    form.valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    )
    .subscribe(value => {
      this.surveyService.updateQuestion(value as any).subscribe(response => console.log(response));
    })
  }

  addQuestion(question: Question) {
    let form = new FormGroup({
      questionId: new FormControl<string | null>(question.questionId),
      description: new FormControl<string>(question.description, [Validators.required, Validators.maxLength(255)]),
      selectionNumber: new FormControl<number>(question.selectionNumber, [Validators.required, Validators.min(1)]),
      surveyId: new FormControl<string>(question.surveyId, [Validators.required]),
      options: new FormArray<FormGroup>((question.options || [])
        .map(option => {
          return new FormGroup({
            questionId: new FormControl<string>(option.questionId),
            optionId: new FormControl<string>(option.optionId),
            description: new FormControl<string>(option.description)
          })
        })
      )
    });

    this.createFormListener(form);
    this.questionsForm.push(form)    
  }

  asFormArray(control: AbstractControl | null): FormArray {
    return control as FormArray;
  }

  asFormControl(control: AbstractControl | null): FormControl {
    return control as FormControl;
  }


  async removeQuestion(questionId: string, index: number) {
    this.isLoadingQuestionOption = true;
    const deleted = await firstValueFrom(this.surveyService.deleteQuestion(questionId));
    if (deleted)
      this.questionsForm.removeAt(index);

    setTimeout(() => this.isLoadingQuestionOption = false, 0)
  }

  async removeOption(optionId: string, questionIndex: number, optionIndex: number) {
    const deleted = await firstValueFrom(this.surveyService.deleteQuestionOption(optionId));
    if (deleted)
      (this.questionsForm.at(questionIndex).get('options') as FormArray).removeAt(optionIndex);
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

  addResponse(questionForm: AbstractControl | null) {
    this.isLoadingQuestionOption = true;

    if (questionForm) {
      let questionFormResponse = questionForm.get('options') as FormArray;
      let questionId: string = questionForm.get('questionId')?.value;

      if (questionFormResponse && questionId) {
        this.surveyService.createQuestionOption({
          optionId: '',
          description: '', 
          questionId,
        })
        .subscribe(response => {
          if (response) {
            let form =  new FormGroup({
              questionId: new FormControl(response.questionId),
              optionId: new FormControl(response.optionId),
              description: new FormControl(response.description)
            });

            questionFormResponse.push(form);
            this.isLoadingQuestionOption = false;
          }          
        })
      }
    }
    
  }

  ngOnInit() {
    this.questions.forEach(item => this.addQuestion(item))
  }

}