import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroment/enviroment';
import { Package } from '../pages/apps/ticketlist/ticket';


@Injectable({
  providedIn: 'root'
})
export class PackageService {

  private apiUrl = '';

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiLocalBaseUrl;
  }

  // VALIDATE TOKEN
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

  // GET TOKEN FROM LOCAL STORAGE
  getToken(): string | null {
    return localStorage.getItem('TICKET');
  }

  // GET PACKAGES
  GET_PACKAGES(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.apiUrl}/GET_ALL_PACKAGES`, { headers });
  }

  // ADD PACKAGE
  ADD_PACKAGE(newPackage: Package): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });
    const requestBody = {
      "name": newPackage.name,
      "destination": newPackage.destination,
      "numberOfPeople": newPackage.numberOfPeople,
      "duration": newPackage.duration,
      "price": newPackage.price,
      "hotels": newPackage.hotels,
      "status": newPackage.status,
      "sell": newPackage.sell,
      "note": newPackage.note
    };
    return this.http.post<any>(this.apiUrl + '/ADD_PACKAGE', requestBody, { headers })
  }


    // ADD PACKAGE
    DELETE_PACKAGE(delPackage: Package): Observable<any> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json'
      });
      const requestBody = {
       "id":delPackage._id
      };
      return this.http.post<any>(this.apiUrl + '/DELETE_PACKAGE', requestBody, { headers })
    }
}