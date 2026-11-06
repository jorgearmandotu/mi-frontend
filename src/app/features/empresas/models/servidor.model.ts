export interface DireccionIp {
  id: number;
  direccion: string;
}

export interface InterfazRed {
  id: number;
  nombre: string;
  direccionMac: string;
  direccionesIp: DireccionIp[];
}

export interface Servidor {
  id: number;
  empresaId: number;
  naturaleza: string;
  servidorAnfitrionId: number;
  nombreServidorAnfitrion: string;
  nombre: string;
  plataforma: string;
  versionSistemaOperativo: string;
  nucleos: number;
  ramGb: number;
  tipoGestionHardware: string;
  ipGestionHardware: string;
  datosOpcionales: string;
  interfacesRed: InterfazRed[];
}

export interface ServidorAnfitrion {
  id: number;
  nombre: string;
}

export interface ServidorInput {
  nombre: string;
  naturaleza: string;
  plataforma: string;
  versionSistemaOperativo: string;
  nucleos: number;
  ramGb: number;
  servidorAnfitrionId: number;
  tipoGestionHardware: string;
  ipGestionHardware: string;
  datosOpcionales: string;
  interfacesRed: InterfazRedInput[];
}

export interface InterfazRedInput {
  nombre: string;
  direccionMac: string;
  direccionesIp: DireccionIpInput[];
}

export interface DireccionIpInput {
  direccion: string;
}

export interface OpcionesServidor {
  naturalezasServidor: string[];
  tiposGestionHardware: string[];
}
