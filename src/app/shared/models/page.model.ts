/** Respuesta paginada genérica. Ajusta los campos al formato de tu API. */
export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
