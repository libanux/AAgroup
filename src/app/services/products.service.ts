import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroment/enviroment';
import { DateSelectedSignal } from '../signals/DateSelectedSignal.service';
import { Product } from '../classes/products.class';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = '';
  private storedToken = '';
  private user_id = ''
  constructor(private httpClient: HttpClient, private dateSignal: DateSelectedSignal, private generalService: GeneralService) {
    this.apiUrl = environment.apiLocalBaseUrl;
    this.storedToken = this.generalService.storedToken;
    // this.user_id = localStorage.getItem('admin_id')

  }

  // GET TOKEN FROM LOCAL STORAGE
  getToken(): string | null {
    return localStorage.getItem('TICKET');
  }

  //GET ALL PRODUCT
  GET_ALL_PRODUCT(CURRENT_PAGE: number, PAGE_SIZE: number, SORT_FIELD: string, SORT_ORDER: string): Observable<any> {
    let startRow = CURRENT_PAGE * PAGE_SIZE
    let endRow = PAGE_SIZE + (CURRENT_PAGE * PAGE_SIZE)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.storedToken}`,
      'Content-Type': 'application/json'
    });
    const requestBody = {
      "start_row": startRow,
      "end_row": endRow,
      "sort_field": SORT_FIELD,
      "sort_order": SORT_ORDER,
      "owner_id": environment.owner_id
    }
    return this.httpClient.post<any>(this.apiUrl + '/GET_ALL_PRODUCTS_BY_OWNER_ID', requestBody, { headers });
  }

  //UPDATE PRODUCT
  UPDATE_PRODUCT(PRODUCT: Product): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.storedToken}`,
      'Content-Type': 'application/json'
    });
    const requestBody = {
      "_id": PRODUCT._id,
      "name": PRODUCT.name,
      "description": PRODUCT.description,
      "category": PRODUCT.category,
      "cost": PRODUCT.cost,
      "sale": PRODUCT.sale,
      "user_id": localStorage.getItem('admin_id'),
      "owner_id": environment.owner_id
    };
    return this.httpClient.post<any>(this.apiUrl + '/UPDATE_PRODUCT_BY_ID', requestBody, { headers });
  }

  //ADD PRODUCT
  ADD_PRODUCT(PRODUCT: Product): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.storedToken}`,
      'Content-Type': 'application/json'
    });
    // Define the request body
    const requestBody = {
      "name": PRODUCT.name,
      "barcode": PRODUCT.barcode,
      "category": PRODUCT.category,
      "description": PRODUCT.description,
      "cost": PRODUCT.cost,
      "sale": PRODUCT.sale,
      "user_id": localStorage.getItem('admin_id'),
      "owner_id": environment.owner_id
    };
    return this.httpClient.post<any>(this.apiUrl + '/CREATE_PRODUCT', requestBody, { headers });
  }

  //DELETE PRODUCT
  DELETE_PRODUCT(ID: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.storedToken}`,
      'Content-Type': 'application/json'
    });

    const requestBody = { "id": ID };

    return this.httpClient.post<any>(this.apiUrl + '/DELETE_PRODUCT_BY_ID', requestBody, { headers });
  }

  //GET PRODUCT BY ID
  // GET_PRODUCT_BY_ID(paymentID: number): Observable<any> {
  //   const jwt = this.generalService.storedToken;
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${this.storedToken}`,
  //     'Content-Type': 'application/json'
  //   });
  //   const requestBody = {
  //     PAYMENT_ID: paymentID
  //   };
  //   return this.httpClient.post<any>(this.apiUrl + '/GET_PAYMENT_BY_PAYMENT_ID_ADV', requestBody, { headers });
  // }


  // FILTER Product BY DATE
  FILTER_PRODUCT(filterType: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });

    const requestBody = {
      "filterType": filterType,
      "startDate": this.dateSignal.startDate(),
      "endDate": this.dateSignal.endDate()
    };
    return this.httpClient.post<any>(this.apiUrl + '/FILTER_ProductS_BY_DATE', requestBody, { headers })
  }

}
