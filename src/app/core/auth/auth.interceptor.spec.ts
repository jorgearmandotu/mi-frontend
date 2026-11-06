import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { API_URL } from '../config/api-url.token';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('authInterceptor', () => {
  const apiUrl = 'http://api.test';
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: apiUrl },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
    localStorage.clear();
  });

  it('no agrega Authorization si no hay token', () => {
    http.get(`${apiUrl}/x`).subscribe();
    const req = controller.expectOne(`${apiUrl}/x`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('agrega el Bearer token a peticiones hacia la API', () => {
    const auth = TestBed.inject(AuthService);
    auth.login({ email: 'a@b.c', password: 'x' }).subscribe();
    controller.expectOne(`${apiUrl}/auth/login`).flush({
      accessToken: 'abc',
      tokenType: 'Bearer',
      expiresAt: '2026-11-05T23:37:48.4302082+00:00',
      usuario: {
        id: 2,
        nombre: 'Administrador',
        email: 'admin@example.com',
        rol: 'Administrador',
        activo: true,
        fechaCreacion: '2026-11-05T02:50:50.160089+00:00',
      },
    });

    http.get(`${apiUrl}/x`).subscribe();
    const req = controller.expectOne(`${apiUrl}/x`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc');
    req.flush({});
  });

  it('no filtra el token a dominios externos', () => {
    const auth = TestBed.inject(AuthService);
    auth.login({ email: 'a@b.c', password: 'x' }).subscribe();
    controller.expectOne(`${apiUrl}/auth/login`).flush({
      accessToken: 'abc',
      tokenType: 'Bearer',
      expiresAt: '2026-11-05T23:37:48.4302082+00:00',
      usuario: {
        id: 2,
        nombre: 'Administrador',
        email: 'admin@example.com',
        rol: 'Administrador',
        activo: true,
        fechaCreacion: '2026-11-05T02:50:50.160089+00:00',
      },
    });

    http.get('http://otro-dominio.com/x').subscribe();
    const req = controller.expectOne('http://otro-dominio.com/x');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
