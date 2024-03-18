import { Injectable } from "@angular/core";
import { AppService } from "../app.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, catchError, map } from "rxjs";
import { Survey } from "./survey";
import { environment } from "../utils/config";
import { Question } from "../questions/question";

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

  public getQuestions(surveyId: string): Observable<Question[]> {
    return this._http.get<Question[]>(`${environment.api_host}/surveys/${surveyId}/questions`).pipe(
      catchError(this.appService.handleError([]))
    )
  }

  createSurvey(data: Survey): Observable<Survey | undefined> {
    let headers = new HttpHeaders({
      "Content-type": 'application/json'
    });

    const survey = {
      name: data.name,
      expirationDate: `${data.expirationDate.getFullYear().toString()}-${(data.expirationDate.getMonth() + 1).toString().padStart(2, '0')}-${data.expirationDate.getDate().toString().padStart(2, '0')}`
    };

    return this._http.post<Survey>(`${environment.api_host}/surveys`, survey, { headers }).pipe(
      catchError(this.appService.handleError(undefined))
    )
  }

  createQuestion(data: Question): Observable<Question | undefined> {
    let headers = new HttpHeaders({
      "Content-type": 'application/json'
    });

    const question = {
      description: data.description,
      selectionNumber: data.selectionNumber
    };

    return this._http.post<Question>(`${environment.api_host}/surveys/${data.surveyId}/questions`, question, { headers }).pipe(
      catchError(this.appService.handleError(undefined))
    )
  }

  updateSurvey(data: Survey): Observable<Survey | undefined> {
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

}