import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroment/enviroment';
import { GeneralService } from './general.service';
import { CustomerClass } from '../classes/customers.class';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = '';

  constructor(private httpClient: HttpClient, private generalService: GeneralService) {
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
    // return localStorage.getItem('TICKET');
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjY3YzkyNDdlY2YxOWRjOWQ5ZTgzYjhmIiwib3duZXJfaWQiOiI2NjdjOTI0N2VjZjE5ZGM5ZDllODNiODkiLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3MTk0ODM5OTYsImV4cCI6MTcxOTU3MDM5Nn0.n2nO4YT7Rxmw9pPIcgtBs-BJcyIHPbxu32Ygmbhz4IA'
  }

  //GET ALL CUSTOMER
  GET_ALL_CUSTOMER(START_ROW: number, END_ROW: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });
    const requestBody = {
      "start_row":START_ROW,
      "end_row":END_ROW,
      "sort_field":"id",
      "sort_order":"ASC",
      "owner_id":"667881ff4488ac3c152b440c" 
    }
    return this.httpClient.post<any>(this.apiUrl + '/GET_ALL_CUSTOMERS_BY_OWNER_ID', requestBody, { headers });
  }

  //UPDATE CUSTOMER
  UPDATE_CUSTOMER(CUSTOMER: CustomerClass): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });
    const requestBody = {
    //   "CUSTOMERId": CUSTOMER._id,
    //   "customerId": CUSTOMER.customer.id,
    //   "customerName": CUSTOMER.customer.name,
    //   "phoneNumber": CUSTOMER.customer.phoneNumber,
    //   "country": CUSTOMER.country,
    //   "type": CUSTOMER.type,
    //   "sell": CUSTOMER.sell,
    //   "status": CUSTOMER.status,
    //   "note": CUSTOMER.note,
    };

    return this.httpClient.post<any>(this.apiUrl + '/UPDATE_CUSTOMER', requestBody, { headers });
  }

  //ADD CUSTOMER
  ADD_CUSTOMER(CUSTOMER: CustomerClass): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });
    const requestBody = {
      "first_name": CUSTOMER.first_name,
      "last_name": CUSTOMER.last_name,
      "email": CUSTOMER.email,
      "number": CUSTOMER.number,
      "country_code": CUSTOMER.country_code,
      "company_name": CUSTOMER.company_name,
      "owner_id": '667881ff4488ac3c152b440c',
    };  
    return this.httpClient.post<any>(this.apiUrl + '/ADD_CUSTOMER', requestBody, { headers });
  }

  //DELETE CUSTOMER
  DELETE_CUSTOMER(ID: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });
    const requestBody = { "id": ID };
    return this.httpClient.post<any>(this.apiUrl + '/DELETE_CUSTOMER', requestBody, { headers });
  }

  // FILTER FUNCTION BY : SEARCH KEY , STATUS AND DATE
  FILTER_AND_SEARCH_CUSTOMERS(SEARCK_KEY: string, FILTER_TYPE: string, START_DATE: string, END_DATE: string, STATUS: string, CURRENT_PAGE: number, PAGE_SIZE: number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });
    const requestBody = {
      "search": SEARCK_KEY,
      "filterType": FILTER_TYPE,
      "startDate": START_DATE,
      "endDate": END_DATE,
      "status": STATUS,
      "page": CURRENT_PAGE,
      "pageSize": PAGE_SIZE
    };
    return this.httpClient.post<any>(this.apiUrl + '/SEARCH_AND_FILTER_CUSTOMERS', requestBody, { headers });
  }

}
