export interface Sede {
  direccion: string;
}

export interface Empresa {
  id: number;
  nit: string;
  nombre: string;
  sedes: Sede[];
  habilitada: boolean;
}
