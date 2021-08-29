import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RegisterPayload} from './auth/register-payload';
import {Observable} from 'rxjs';
import {LoginPayload} from './auth/login-payload';
import {JwtAutResponse} from './auth/jwt-aut-response';
import {map} from 'rxjs/operators';
import {LocalStorageService} from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:8080/api/auth/';

   constructor(private httpClient: HttpClient, private LocalStorageService: LocalStorageService) {
   }

   register(registerPayload: RegisterPayload): Observable<any> {
     return this.httpClient.post(this.url + 'signup', registerPayload);
   }

   login(loginPayload: LoginPayload): Observable<boolean> {
    return this.httpClient.post<JwtAutResponse>(this.url + 'login', loginPayload).pipe(map(data => {
      this.LocalStorageService.store('authenticationToken', data.authenticationToken);
      this.LocalStorageService.store('username', data.username);
      return true;
    }));
  }

  isAuthenticated(): boolean {
     return this.LocalStorageService.retrieve('username') != null;
   }

   logout() {
    this.LocalStorageService.clear('authenticationToken');
    this.LocalStorageService.clear('username');
  }
}
