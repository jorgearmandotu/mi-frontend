import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

/** URL base de la API. Se inyecta en vez de importar `environment` directamente. */
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => environment.apiUrl,
});
