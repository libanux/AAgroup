import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroment/enviroment';
import { GeneralService } from './general.service';
import { UserClass } from '../classes/users.class';
import { User } from 'angular-feather/icons';

@Injectable({
    providedIn: 'root'
})
export class UserService {

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

    //GET ALL USER
    GET_ALL_USER(Current_page: number, PageSize: number): Observable<any> {
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
        return this.httpClient.post<any>(this.apiUrl + '/GET_ALL_USERS_BY_OWNER_ID', requestBody, { headers });
    }

    //GET USER BY USER ID 
    GET_USER_BY_USER_ID(USER_ID: string): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        });
        const requestBody = {
            "id": USER_ID,
            "owner_id": environment.owner_id
        };

        return this.httpClient.post<any>(this.apiUrl + '/GET_USER_BY_ID', requestBody, { headers });
    }

    //UPDATE USER
    UPDATE_USER(USER: UserClass): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        });
        const requestBody = {
            "_id": USER._id,
            "first_name": USER.first_name,
            "last_name": USER.last_name,
            "email": USER.email,
            "role": USER.role,
        };
        return this.httpClient.post<any>(this.apiUrl + '/UPDATE_USER_BY_ID', requestBody, { headers });
    }

    //ADD USER
    ADD_USER(USER: UserClass): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        });
        const requestBody = {
            "first_name": USER.first_name,
            "last_name": USER.last_name,
            "email": USER.email,
            "password": USER.password,
            "role": USER.role,
            "owner_id": environment.owner_id
        };
        return this.httpClient.post<any>(this.apiUrl + '/SIGN_UP', requestBody, { headers });
    }

    //DELETE USER
    DELETE_USER(ID: string): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        });
        const requestBody = {
            "id": ID,
            "owner_id": environment.owner_id
        };
        return this.httpClient.post<any>(this.apiUrl + '/DELETE_USER_BY_ID', requestBody, { headers });
    }

    // FILTER FUNCTION BY : SEARCH KEY , STATUS AND DATE
    // FILTER_AND_SEARCH_USERS(SEARCK_KEY: string, FILTER_TYPE: string, START_DATE: string, END_DATE: string, STATUS: string, CURRENT_PAGE: number, PAGE_SIZE: number) {
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
    //     return this.httpClient.post<any>(this.apiUrl + '/SEARCH_AND_FILTER_USERS', requestBody, { headers });
    // }

}
