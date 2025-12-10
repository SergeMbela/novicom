import { Injectable } from '@angular/core';

export interface User {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Dans une vraie application, cette valeur viendrait d'un token, d'un cookie, etc.
  private currentUser: User | null = null;

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  login(user: User) {
    this.currentUser = user;
  }

  logout() {
    this.currentUser = null;
  }
}