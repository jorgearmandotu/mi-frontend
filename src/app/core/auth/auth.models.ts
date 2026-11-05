export interface LoginRequest {
  email: string;
  password: string;
}

/** Ajusta esta forma al contrato real de tu endpoint de login. */
export interface LoginResponse {
  token: string;
}
