import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../core/config/api-url.token';
import { Usuario } from '../models/usuario.model';

/** Acceso a datos del feature: es el único lugar que conoce los endpoints de usuarios. */
@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${inject(API_URL)}/usuarios`;

  /** Recurso reactivo para lecturas: expone value(), isLoading(), error() y reload(). */
  listar() {
    return httpResource<Usuario[]>(() => this.apiUrl, { defaultValue: [] });
  }

  /** Las escrituras (POST/PUT/DELETE) usan HttpClient y devuelven Observable. */
  crear(usuario: Omit<Usuario, 'id'>) {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
