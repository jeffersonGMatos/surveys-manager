import { Injectable } from "@angular/core";
import { AppService } from "../app.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, catchError, map } from "rxjs";
import { Survey } from "./survey";
import { environment } from "../utils/config";
import { Question, QuestionOption } from "../questions/question";

@Injectable({
  providedIn: 'root'
})
export class SurveysService {

  constructor(
    private appService: AppService,
    private _http: HttpClient
  ) {}


  public getSurveys(): Observable<Survey[]> {
    return this._http.get<Survey[]>(`${environment.api_host}/surveys`).pipe(
      catchError(this.appService.handleError([]))
    )
  }

  public getSurvey(surveyId: string): Observable<Survey | undefined> {
    return this._http.get<any>(`${environment.api_host}/surveys/${surveyId}`).pipe(
      catchError(this.appService.handleError(undefined)),
      map(survey => {
        if (survey)
          return {
            ...survey,
            expirationDate: new Date(`${survey.expirationDate} 03:00:00`)
          } as Survey

        return undefined
      })
    )
  }

  public createSurvey(data: Survey): Observable<Survey | undefined> {
    let headers = new HttpHeaders({
      "Content-type": 'application/json'
    });

    const survey = {
      name: data.name,
      expirationDate: `${data.expirationDate.getFullYear().toString()}-${(data.expirationDate.getMonth() + 1).toString().padStart(2, '0')}-${data.expirationDate.getDate().toString().padStart(2, '0')}`
    };

    return this._http
      .post<Survey>(`${environment.api_host}/surveys`, survey, {headers})
      .pipe(
        catchError(this.appService.handleError(undefined))
      )
  }

  public createQuestion(data: Question): Observable<Question | undefined> {
    let headers = new HttpHeaders({
      "Content-type": 'application/json'
    });

    const question = {
      description: data.description,
      selectionNumber: data.selectionNumber
    };

    return this._http.post<Question>(`${environment.api_host}/surveys/${data.surveyId}/questions`, question, { headers }).pipe(
      catchError(this.appService.handleError(undefined)),
      map(question => (question ? {...question, selectionNumber: Number(question.selectionNumber)} : undefined))
    )
  }

  public createQuestionOption(data: QuestionOption): Observable<QuestionOption | undefined> {
    let headers = new HttpHeaders({
      "Content-type": 'application/json'
    });

    const option = {
      questionId: data.questionId,
      description: data.description,
    };

    return this._http.post<QuestionOption>(`${environment.api_host}/questions/${option.questionId}/options`, option, { headers }).pipe(
      catchError(this.appService.handleError(undefined)),
      map(option => (option ? option : undefined))
    )
  }

  public updateSurvey(data: Survey): Observable<Survey | undefined> {
    let headers = new HttpHeaders({
      "Content-type": 'application/json'
    });

    const survey = {
      name: data.name,
      expirationDate: `${data.expirationDate.getFullYear().toString()}-${(data.expirationDate.getMonth() + 1).toString().padStart(2, '0')}-${data.expirationDate.getDate().toString().padStart(2, '0')}`
    };

    return this._http.put<Survey>(`${environment.api_host}/surveys/${data.surveyId}`, survey, { headers }).pipe(
      catchError(this.appService.handleError(undefined))
    )
  }

  public updateQuestion(data: Question): Observable<Question | undefined> {
    let headers = new HttpHeaders({
      "Content-type": 'application/json'
    });

    const question = {
      description: data.description,
      selectionNumber: Number(data.selectionNumber),
      options: data.options || []
    };

    return this._http.put<Question>(`${environment.api_host}/questions/${data.questionId}`, question, { headers }).pipe(
      catchError(this.appService.handleError(undefined))
    )
  }

  public deleteQuestion(questionId: string): Observable<boolean> {
    let headers = new HttpHeaders({
      "Content-type": 'application/json'
    });

    return this._http.delete<Question>(`${environment.api_host}/questions/${questionId}`, { headers }).pipe(
      catchError(this.appService.handleError(false)),
      map(response => response !== false ? true : false)
    )
  }

  public deleteSurvey(surveyId: string): Observable<boolean> {
    let headers = new HttpHeaders({
      "Content-type": 'application/json'
    });

    return this._http.delete<Question>(`${environment.api_host}/surveys/${surveyId}`, { headers }).pipe(
      catchError(this.appService.handleError(false)),
      map(response => response !== false ? true : false)
    )
  }

  public deleteQuestionOption(optionId: string): Observable<boolean> {
    let headers = new HttpHeaders({
      "Content-type": 'application/json'
    });

    return this._http.delete<Question>(`${environment.api_host}/options/${optionId}`, { headers }).pipe(
      catchError(this.appService.handleError(false)),
      map(response => response !== false ? true : false)
    )
  }
}