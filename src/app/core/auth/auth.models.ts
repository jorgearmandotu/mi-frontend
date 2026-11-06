export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  fechaCreacion: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  usuario: AuthenticatedUser;
}
