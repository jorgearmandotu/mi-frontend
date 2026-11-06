import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../core/config/api-url.token';
import { Empresa } from '../models/empresa.model';

@Injectable({ providedIn: 'root' })
export class EmpresasService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${inject(API_URL)}/empresas`;

  listar() {
    return httpResource<Empresa[]>(() => this.apiUrl, { defaultValue: [] });
  }

  crear(empresa: Empresa) {
    return this.http.post<Empresa>(this.apiUrl, empresa);
  }
}
