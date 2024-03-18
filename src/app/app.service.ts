import { Injectable } from "@angular/core";
import { environment } from "./utils/config";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, catchError, map, of } from "rxjs";
import { WindowService } from "./window.service";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private _authJwt: string | null = null;
  private window = this.windowService.getWindow();
  public user: BehaviorSubject<any> = new BehaviorSubject(null);
  public appMessage: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private windowService: WindowService,
    private _http: HttpClient
  ) {}

  set authJwt(value: string | null) {
    if (value) 
      this.window.localStorage.setItem('_a', value);
    else
      this.window.localStorage.removeItem('_a');
    
    this._authJwt = value;
  }

  get authJwt(): string | null {
    if (!this._authJwt)
      this._authJwt = this.window.localStorage.getItem('_a');

    return this._authJwt;
  }

  public handleError<T>(def: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.log(error);
      this.appMessage.next(error.error.message || 'Erro desconhecido');
      return of(def);
    }
  }

  public login({username, password}: any): Observable<any> {
    const auth = this.window.btoa(`${username}:${password}`);

    const headers = new HttpHeaders({
      "Authorization": `Basic ${auth}`,
      "Content-type": "application/json"
    });

    return this._http.post(`${environment.api_host}/public/auth`, {}, {headers}).pipe(
      catchError((err: HttpErrorResponse) => 
        of({
          ok: false,
          errorCode: err.error.error,
          error: err.error.message || "Ocorreu um erro"
        })
      ),
      map(response => {
        if (Object.keys(response).includes('error'))
          return response
        else {
          this.authJwt = response as string
          return {
            ok: true
          }
        }

      })
    )

  }

  public auth(): Observable<any> {
    if (!this.authJwt)
      return of(false);

    if (this.user.value)
      return of(true);

    return this._http.get(`${environment.api_host}/auth`).pipe(
      catchError(this.handleError(false)),
      map(response => {
        
        if (response !== false) {
          this.user.next(response);
          return true;
        } else {
          this.user.next(null);
          return false;
        }
      })
    )
  }

}