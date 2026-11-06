import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../core/config/api-url.token';
import { Empresa } from '../models/empresa.model';
import {
  OpcionesServidor,
  Servidor,
  ServidorAnfitrion,
  ServidorInput,
} from '../models/servidor.model';

@Injectable({ providedIn: 'root' })
export class EmpresasService {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl = inject(API_URL);
  private readonly apiUrl = `${this.baseApiUrl}/empresas`;

  listar() {
    return httpResource<Empresa[]>(() => this.apiUrl, { defaultValue: [] });
  }

  listarServidores(empresaId: () => number | undefined) {
    return httpResource<Servidor[]>(() => {
      const id = empresaId();
      return id === undefined ? undefined : `${this.apiUrl}/${id}/servidores`;
    }, { defaultValue: [] });
  }

  obtenerOpcionesServidor() {
    return httpResource<OpcionesServidor>(() => `${this.baseApiUrl}/opciones`);
  }

  listarServidoresFisicos(habilitado: () => boolean) {
    return httpResource<ServidorAnfitrion[]>(
      () => (habilitado() ? `${this.baseApiUrl}/servidores/fisicos` : undefined),
      { defaultValue: [] },
    );
  }

  crearServidor(empresaId: number, servidor: ServidorInput) {
    return this.http.post<Servidor>(`${this.apiUrl}/${empresaId}/servidores`, servidor);
  }

  crear(empresa: Omit<Empresa, 'id'>) {
    return this.http.post<Empresa>(this.apiUrl, empresa);
  }
}
