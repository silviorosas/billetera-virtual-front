import { Injectable } from '@angular/core';

const TOKEN_KEY = 'authToken';
const MESSAGE_KEY = 'AuthMessage';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  public setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public setMessage(message: string): void {
    localStorage.setItem(MESSAGE_KEY, message);
  }

  public getMessage(): string | null {
    return localStorage.getItem(MESSAGE_KEY);
  }

  public logOut(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(MESSAGE_KEY);
  }
}
