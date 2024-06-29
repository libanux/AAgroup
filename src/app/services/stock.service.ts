import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroment/enviroment';
import { DateSelectedSignal } from '../signals/DateSelectedSignal.service';
import { StockClass } from '../classes/stock.class';

@Injectable({
  providedIn: 'root'
})
export class stocksService {

  private apiUrl = '';

  constructor(private httpClient: HttpClient, private dateSignal: DateSelectedSignal,) {
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

  // GET ALL STOCKS
  GET_ALL_STOCKS(CURRENT_PAGE: number, PAGE_SIZE: number, SORT_FIELD: string, SORT_ORDER: string): Observable<any> {
    let startRow = CURRENT_PAGE * PAGE_SIZE
    let endRow = PAGE_SIZE + (CURRENT_PAGE * PAGE_SIZE)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });
    const requestBody = {
      "start_row": startRow,
      "end_row": endRow,
      "sort_field": SORT_FIELD,
      "sort_order": SORT_ORDER,
      "owner_id": environment.owner_id
    }
    return this.httpClient.post<any>(this.apiUrl + '/GET_ALL_STOCKS_BY_PRODUCT_ID', requestBody, { headers });
  }


  // ADD STOCK
  ADD_STOCK(STOCK: StockClass): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });
    // Define the request body
    const requestBody = {
      // "barcode": STOCK.barcode,
      // "email": STOCK.email,
      // "number": STOCK.number,
      // "country_code": STOCK.country_code,
      // "company_name": STOCK.company_name,
      // "owner_id": environment.owner_id
    };
    return this.httpClient.post<any>(this.apiUrl + '/CREATE_STOCK', requestBody, { headers });
  }


  // DELETE STOCK
  DELETE_STOCK(ID: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });
    const requestBody = {
      "id": ID,
      "owner_id":  environment.owner_id
  }
    return this.httpClient.post<any>(this.apiUrl + '/DELETE_STOCK_BY_ID', requestBody, { headers })
  }

  // FILTER STOCK BY DATE
  FILTER_stock(filterType: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });

    const requestBody = {
      "search": "example",
      "filterType": "thisMonth",
      "startDate": "2023-06-01",
      "endDate": "2023-06-30",
      "category":"",
      "page": 1,
      "pageSize": 10
    }
    return this.httpClient.post<any>(this.apiUrl + '/FILTER_stockS_BY_DATE', requestBody, { headers })
  }

}
