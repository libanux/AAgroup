import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroment/enviroment';
import { DateSelectedSignal } from '../signals/DateSelectedSignal.service';
import { GeneralService } from './general.service';
import { SupplierClass } from '../classes/suppliers.class';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

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

  //GET ALL SUPPLIER
  GET_ALL_SUPPLIER(CURRENT_PAGE: number, PAGE_SIZE: number, SORT_FIELD: string, SORT_ORDER: string): Observable<any> {
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
    return this.httpClient.post<any>(this.apiUrl + '/GET_ALL_SUPPLIERS_BY_OWNER_ID', requestBody, { headers });
  }

  //UPDATE SUPPLIER
  UPDATE_SUPPLIER(SUPPLIER: SupplierClass): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.storedToken}`,
      'Content-Type': 'application/json'
    });
    const requestBody = {
      "_id": SUPPLIER._id,
      "contact_name": SUPPLIER.contact_name,
      "owner_id": environment.owner_id,
      "email": SUPPLIER.email,
      "number": SUPPLIER.number,
      "company_name": SUPPLIER.company_name,
    };
    return this.httpClient.post<any>(this.apiUrl + '/UPDATE_SUPPLIER_BY_ID', requestBody, { headers });
  }

  //ADD SUPPLIER
  ADD_SUPPLIER(SUPPLIER: SupplierClass): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.storedToken}`,
      'Content-Type': 'application/json'
    });
    // Define the request body
    const requestBody = {
      "contact_name": SUPPLIER.contact_name,
      "email": SUPPLIER.email,
      "number": SUPPLIER.number,
      "company_name": SUPPLIER.company_name,
      "owner_id": environment.owner_id
    };
    return this.httpClient.post<any>(this.apiUrl + '/CREATE_SUPPLIER', requestBody, { headers });
  }

  //DELETE SUPPLIER
  DELETE_SUPPLIER(ID: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.storedToken}`,
      'Content-Type': 'application/json'
    });
    const requestBody = { 
      "id": ID,
      "owner_id": environment.owner_id
     };
    return this.httpClient.post<any>(this.apiUrl + '/DELETE_SUPPLIER_BY_ID', requestBody, { headers });
  }

  // GET SUPPLIER BY ID
  GET_SUPPLIER_BY_ID(ID: string): Observable<any> {
    const jwt = this.generalService.storedToken;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.storedToken}`,
      'Content-Type': 'application/json'
    });
    const requestBody = {
      "id": ID,
      "owner_id": environment.owner_id
    };
    return this.httpClient.post<any>(this.apiUrl + '/GET_PAYMENT_BY_PAYMENT_ID_ADV', requestBody, { headers });
  }


  // FILTER SUPPLIER BY DATE
//   FILTER_SUPPLIER(filterType: string): Observable<any> {
//     const headers = new HttpHeaders({
//       'Authorization': `Bearer ${this.getToken()}`,
//       'Content-Type': 'application/json'
//     });

//     const requestBody = {
//       "filterType": filterType,
//       "startDate": this.dateSignal.startDate(),
//       "endDate": this.dateSignal.endDate()
//     };
//     return this.httpClient.post<any>(this.apiUrl + '/FILTER_ProductS_BY_DATE', requestBody, { headers })
//   }

}
