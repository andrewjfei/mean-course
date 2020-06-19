import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService {

    private token: string;

    constructor(private http: HttpClient) {}

    getToken() {
        return this.token;
    }

    createUser(email: string, password: string) {
        const authData: AuthData = { email: email, password: password };
        this.http.post('http://localhost:3000/api/user/signup', authData)
        .subscribe(response => {
            console.log(response);
        });
    }

    loginUser(email: string, password: string) {
        const authData: AuthData = { email: email, password: password };
        this.http.post('http://localhost:3000/api/user/login', authData)
        .subscribe((response: { token: string }) => {
            console.log(response);
            const token = response.token;
            this.token = token;
        });
    }

}