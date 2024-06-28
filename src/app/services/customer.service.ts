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
        return localStorage.getItem('TICKET');
        // return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjY3YzkyNDdlY2YxOWRjOWQ5ZTgzYjhmIiwib3duZXJfaWQiOiI2NjdjOTI0N2VjZjE5ZGM5ZDllODNiODkiLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3MTk0ODM5OTYsImV4cCI6MTcxOTU3MDM5Nn0.n2nO4YT7Rxmw9pPIcgtBs-BJcyIHPbxu32Ygmbhz4IA'
    }

    //GET ALL CUSTOMER
    GET_ALL_CUSTOMER(Current_page: number, PageSize: number): Observable<any> {
        let startRow = Current_page * PageSize
        let endRow = PageSize + (Current_page * PageSize)

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        });
        const requestBody = {
            "start_row": startRow,
            "end_row": endRow,
            "sort_field": "id",
            "sort_order": "ASC",
            "owner_id": environment.owner_id
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
            "_id": CUSTOMER._id,
            "first_name": CUSTOMER.first_name,
            "last_name": CUSTOMER.last_name,
            "email": CUSTOMER.email,
            "number": CUSTOMER.number,
            "country_code": CUSTOMER.country_code,
            "company_name": CUSTOMER.company_name,
            "owner_id": environment.owner_id
        };

        return this.httpClient.post<any>(this.apiUrl + '/UPDATE_CUSTOMER_BY_ID', requestBody, { headers });
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
            "owner_id": environment.owner_id
        };
        return this.httpClient.post<any>(this.apiUrl + '/CREATE_CUSTOMER', requestBody, { headers });
    }

    //DELETE CUSTOMER
    DELETE_CUSTOMER(ID: string): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        });
        const requestBody = {
            "id": ID,
            "owner_id": environment.owner_id
        };
        return this.httpClient.post<any>(this.apiUrl + '/DELETE_CUSTOMER_BY_ID', requestBody, { headers });
    }

    // FILTER FUNCTION BY : SEARCH KEY , STATUS AND DATE
    // FILTER_AND_SEARCH_CUSTOMERS(SEARCK_KEY: string, FILTER_TYPE: string, START_DATE: string, END_DATE: string, STATUS: string, CURRENT_PAGE: number, PAGE_SIZE: number) {
    //     const headers = new HttpHeaders({
    //         'Authorization': `Bearer ${this.getToken()}`,
    //         'Content-Type': 'application/json'
    //     });
    //     const requestBody = {
    //         "search": SEARCK_KEY,
    //         "filterType": FILTER_TYPE,
    //         "startDate": START_DATE,
    //         "endDate": END_DATE,
    //         "status": STATUS,
    //         "page": CURRENT_PAGE,
    //         "pageSize": PAGE_SIZE
    //     };
    //     return this.httpClient.post<any>(this.apiUrl + '/SEARCH_AND_FILTER_CUSTOMERS', requestBody, { headers });
    // }

}
