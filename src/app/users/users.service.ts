import { Injectable } from "@angular/core";
import { AppService } from "../app.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, catchError, map } from "rxjs";
import { User } from "./user";
import { environment } from "../utils/config";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private appService: AppService,
    private _http: HttpClient
  ) {}

  public getUsers(): Observable<User[]> {
    return this._http.get<User[]>(`${environment.api_host}/users`).pipe(
      catchError(this.appService.handleError([]))
    )
  }

  
  public getUser(userId: string): Observable<User | undefined> {
    return this._http.get<any>(`${environment.api_host}/users/${userId}`).pipe(
      catchError(this.appService.handleError(undefined))
    )
  }

  public createUser(data: User): Observable<User | undefined> {
    let headers = new HttpHeaders({
      "Content-type": 'application/json'
    });

    const user = {
      name: data.name,
      username: data.username,
      password: data.password,
      profile: data.profile
    };

    return this._http
      .post<User>(`${environment.api_host}/users`, user, {headers})
      .pipe(
        catchError(this.appService.handleError(undefined))
      )
  }

  public updateUser(data: User): Observable<User | undefined> {
    let headers = new HttpHeaders({
      "Content-type": 'application/json'
    });

    const user = {
      name: data.name,
      username: data.username,
      password: data.password,
      profile: data.profile
    };

    return this._http.put<User>(`${environment.api_host}/users/${data.userId}`, user, { headers }).pipe(
      catchError(this.appService.handleError(undefined))
    )
  }

  public deleteUser(userId: string): Observable<boolean> {
    let headers = new HttpHeaders({
      "Content-type": 'application/json'
    });

    return this._http.delete<User>(`${environment.api_host}/users/${userId}`, { headers }).pipe(
      catchError(this.appService.handleError(false)),
      map(response => response !== false ? true : false)
    )
  }
}