# Convenciones del proyecto (Angular)

Frontend en Angular que consume una API REST propia. Estas reglas aplican a todo el código que se genere o modifique. Si algo no está cubierto aquí, sigue el patrón del feature `usuarios`, que es la referencia.

## Stack

- Angular (última versión estable), TypeScript en modo `strict`, SCSS.
- Standalone components únicamente. **Prohibido `NgModule`.**
- Estado local con **signals** (`signal`, `computed`, `input()`, `output()`).
- Lecturas HTTP con `httpResource`; escrituras con `HttpClient` (Observable).
- Control flow moderno en templates: `@if`, `@for` (siempre con `track`), `@switch`. **Prohibido `*ngIf`, `*ngFor`, `*ngSwitch`.**
- Formularios reactivos tipados (`FormBuilder.nonNullable`).

## Estructura de carpetas

```
src/app/
  core/                    Singletons de la app. Nada de UI reutilizable aquí.
    auth/                  AuthService, authInterceptor, authGuard, modelos de auth
    config/                Tokens de configuración (API_URL)
    http/                  Interceptores globales (errores, logging)
  shared/                  Código reutilizable entre features. No depende de ningún feature.
    ui/                    Componentes de presentación genéricos
    pipes/                 Pipes reutilizables
    models/                Tipos genéricos (Page<T>, etc.)
  features/
    <feature>/
      <feature>.routes.ts  Rutas del feature (carga lazy desde app.routes.ts)
      models/              Interfaces/tipos propios del feature
      data-access/         Servicios que hablan con la API
      pages/<page>/        Componentes enrutados (uno por carpeta: .ts, .html, .scss)
      components/          Componentes propios del feature, no enrutados (opcional)
  app.ts / app.config.ts / app.routes.ts
src/environments/          environment.ts (prod) y environment.development.ts
```

### Reglas de dependencia

- `features/*` puede importar de `core/` y `shared/`.
- `features/*` **no** importa de otro feature. Si dos features comparten algo, súbelo a `shared/`.
- `shared/` no importa de `core/` ni de `features/`.
- `core/` no importa de `features/`.

## Dónde va cada cosa

| Necesito...                              | Va en...                                         |
|------------------------------------------|--------------------------------------------------|
| Llamar un endpoint                       | `features/<f>/data-access/<f>.service.ts`        |
| Un tipo que devuelve la API              | `features/<f>/models/<nombre>.model.ts`          |
| Una pantalla con ruta                    | `features/<f>/pages/<nombre>/`                   |
| Un componente reutilizable por 2+ features | `shared/ui/<nombre>/`                          |
| Agregar un header a todas las peticiones | `core/http/` o `core/auth/` como interceptor     |
| Proteger una ruta                        | `core/auth/*.guard.ts`                           |
| Una URL o valor por ambiente             | `src/environments/` + token en `core/config/`    |

## Nombres de archivos

- Componentes: `nombre.ts`, `nombre.html`, `nombre.scss`. Clase en PascalCase sin sufijo (`UsuariosList`). Selector con prefijo `app-`.
- Servicios: `nombre.service.ts`. Guards: `nombre.guard.ts`. Interceptores: `nombre.interceptor.ts`. Pipes: `nombre.pipe.ts`.
- Modelos: `nombre.model.ts`. Rutas: `nombre.routes.ts`.
- Archivos en `kebab-case`; clases en `PascalCase`; variables y funciones en `camelCase`.

## Reglas de código

1. **Siempre `ChangeDetectionStrategy.OnPush`** en componentes.
2. Inyección con `inject()`, no con constructor.
3. Los templates acceden a miembros `protected readonly`; lo que no usa el template es `private`.
4. Ningún componente usa `HttpClient` directamente. Todo pasa por un servicio en `data-access/`.
5. No importes `environment` fuera de `core/config/`; inyecta `API_URL`.
6. Evita `subscribe()` manual en componentes. Prefiere `httpResource`, `toSignal` o el pipe `async`. Si es inevitable (p. ej. envío de un formulario), maneja `error` y evita fugas con `takeUntilDestroyed`.
7. Prohibido `any`. Si el tipo es desconocido, usa `unknown` y acótalo.
8. Todo `@for` lleva `track` con un identificador estable (nunca `$index` si hay un id).
9. Rutas de features con `loadChildren` o `loadComponent` (lazy). Nada de imports estáticos de páginas en `app.routes.ts`.
10. Sin lógica de negocio en templates; usa `computed()` en la clase.
11. Estilos con SCSS del propio componente. Estilos globales solo en `src/styles.scss`.
12. Texto de UI en español; identificadores de código en el idioma del dominio de la API.

## Cómo crear un feature nuevo

1. `src/app/features/<feature>/` con `models/`, `data-access/`, `pages/`.
2. Crea `<feature>.routes.ts` exportando `<FEATURE>_ROUTES`.
3. Regístralo en `app.routes.ts` con `loadChildren` (y `canActivate: [authGuard]` si requiere sesión).
4. Copia el patrón de `usuarios`: servicio con `httpResource` para lecturas, página con `OnPush`, estados `isLoading()` / `error()` / `value()` en el template.

## Comandos

```bash
npm start        # servidor de desarrollo (http://localhost:4200)
npm run build    # build de producción
npm test         # pruebas unitarias
npx ng generate component features/<f>/pages/<nombre>
npx ng generate service  features/<f>/data-access/<nombre>
```

## Antes de dar una tarea por terminada

- `npm run build` sin errores ni warnings.
- `npm test` en verde.
- Ningún archivo fuera de la estructura descrita arriba.
