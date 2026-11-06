import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_URL } from '../config/api-url.token';
import { AuthenticatedUser, LoginRequest, LoginResponse } from './auth.models';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

function isAuthenticatedUser(value: unknown): value is AuthenticatedUser {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'number' &&
    'nombre' in value &&
    typeof value.nombre === 'string' &&
    'email' in value &&
    typeof value.email === 'string' &&
    'rol' in value &&
    typeof value.rol === 'string' &&
    'activo' in value &&
    typeof value.activo === 'boolean' &&
    'fechaCreacion' in value &&
    typeof value.fechaCreacion === 'string'
  );
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = inject(API_URL);

  private readonly _token = signal<string | null>(this.readToken());
  private readonly _user = signal<AuthenticatedUser | null>(this.readUser());

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);

  login(credentials: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(tap((res) => this.setSession(res)));
  }

  logout(): void {
    this.setSession(null);
    this.router.navigate(['/login']);
  }

  updateUserProfile(profile: Pick<AuthenticatedUser, 'nombre' | 'email'>): void {
    const user = this._user();
    if (!user) {
      return;
    }

    this.setUser({ ...user, ...profile });
  }

  private setSession(response: LoginResponse | null): void {
    const token = response?.accessToken ?? null;
    this._token.set(token);
    this._user.set(response?.usuario ?? null);
    try {
      if (response) {
        localStorage.setItem(TOKEN_KEY, response.accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(response.usuario));
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    } catch {
      // Almacenamiento no disponible: la sesión vive solo en memoria.
    }
  }

  private setUser(user: AuthenticatedUser): void {
    this._user.set(user);
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // Almacenamiento no disponible: la sesión vive solo en memoria.
    }
  }

  private readToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private readUser(): AuthenticatedUser | null {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(USER_KEY) ?? 'null');
      return isAuthenticatedUser(value) ? value : null;
    } catch {
      return null;
    }
  }
}
