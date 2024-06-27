import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '';

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiLocalBaseUrl
  }

  //VALIDATE TOKEN
  isTokenExpired1(): boolean {
    const token = this.getToken();
    if (!token) return true;
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return true;
    const payload = JSON.parse(atob(tokenParts[1]));
    if (!payload.exp) return true;
    const expirationTime = payload.exp * 1000;
    const currentTime = new Date().getTime();
    return expirationTime < currentTime;
  }

  //GET TOKEN FROM LOCAL STORAGE
  getToken(): string | null {
    return localStorage.getItem('TICKET');
  }

  //LOGIN FUNCTION
  SIGN_IN(params: Params_Authenticate): Observable<any> {
    const url = `${this.apiUrl}/SIGN_IN`;
    return this.http.post<any>(url, params);
  }

  LOGOUT(){
    localStorage.setItem('TICKET',''),
    localStorage.setItem('admin_id', '')
  }
}

export class Params_Authenticate {
  email?: string;
  password?: string;
}
