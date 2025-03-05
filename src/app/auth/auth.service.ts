import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new Subject<User>();
  constructor(private http: HttpClient) {}

  signup(email: string, password: string): Observable<AuthResponseData> {
    const API_KEY = environment.apiKey;
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((errorRes) => {
          let errorMessage = 'An unknown error occurred!';
          if (!errorRes.error || !errorRes.error.error) {
            throw new Error(errorMessage);
          }
          switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'This email exists already!';
          }
          throw new Error(errorMessage);
        }),
        tap((resData) => {
          this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    const API_KEY = environment.apiKey;
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(() => {
          throw this.handleError;
        }),
        tap((resData) => {
          this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!error.error || !error.error.error) {
      return new Error(errorMessage);
    }
    switch (error.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist!';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct!';
        break;
      case 'USER_DISABLED':
        errorMessage = 'This user is disabled!';
        break;
    }
    return new Error(errorMessage);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
  }
}

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
