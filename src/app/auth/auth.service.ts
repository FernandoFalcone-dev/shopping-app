import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signup(email: string, password: string): Observable<AuthResponseData> {
    const API_KEY = 'AIzaSyDBH0D6YzjteToCRBxGcrlhgAhE42YiezI';
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,{
      email: email,
      password: password,
      returnSecureToken: true
    })
  }
}

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}
