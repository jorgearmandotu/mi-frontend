export interface Sede {
  direccion: string;
}

export interface Empresa {
  nit: string;
  nombre: string;
  sedes: Sede[];
  habilitada: boolean;
}
