import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmpresasService } from '../../data-access/empresas.service';

type DireccionIpForm = FormGroup<{ direccion: FormControl<string> }>;
type InterfazRedForm = FormGroup<{
  nombre: FormControl<string>;
  direccionMac: FormControl<string>;
  direccionesIp: FormArray<DireccionIpForm>;
}>;

@Component({
  selector: 'app-empresas-list',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './empresas-list.html',
  styleUrl: './empresas-list.scss',
})
export class EmpresasList {
  private readonly empresasService = inject(EmpresasService);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly destroyRef = inject(DestroyRef);

  protected readonly empresas = this.empresasService.listar();
  protected readonly opcionesServidor = this.empresasService.obtenerOpcionesServidor();
  protected readonly empresaSeleccionadaId = signal<number | null>(null);
  protected readonly mostrarFormularioServidor = signal(false);
  protected readonly servidoresFisicos = this.empresasService.listarServidoresFisicos(
    () => this.mostrarFormularioServidor(),
  );
  protected readonly guardandoServidor = signal(false);
  protected readonly errorServidor = signal<string | null>(null);
  protected readonly mensajeServidor = signal<string | null>(null);
  protected readonly servidorForm = this.fb.group({
    nombre: ['', Validators.required],
    naturaleza: ['', Validators.required],
    plataforma: ['', Validators.required],
    versionSistemaOperativo: ['', Validators.required],
    nucleos: [0, [Validators.required, Validators.min(0)]],
    ramGb: [0, [Validators.required, Validators.min(0)]],
    servidorAnfitrionId: [0, [Validators.required, Validators.min(0)]],
    tipoGestionHardware: [''],
    ipGestionHardware: [''],
    datosOpcionales: [''],
    interfacesRed: this.fb.array([this.crearInterfazRed()]),
  });
  protected readonly servidores = this.empresasService.listarServidores(
    () => this.empresaSeleccionadaId() ?? undefined,
  );

  protected get interfacesRed(): FormArray<InterfazRedForm> {
    return this.servidorForm.controls.interfacesRed;
  }

  protected direccionesIp(interfaz: InterfazRedForm): FormArray<DireccionIpForm> {
    return interfaz.controls.direccionesIp;
  }

  protected alternarServidores(empresaId: number): void {
    this.empresaSeleccionadaId.update((seleccionada) =>
      seleccionada === empresaId ? null : empresaId,
    );
    this.mostrarFormularioServidor.set(false);
    this.errorServidor.set(null);
    this.mensajeServidor.set(null);
  }

  protected alternarFormularioServidor(): void {
    this.mostrarFormularioServidor.update((mostrar) => !mostrar);
    this.errorServidor.set(null);
    this.mensajeServidor.set(null);
  }

  protected agregarInterfazRed(): void {
    this.interfacesRed.push(this.crearInterfazRed());
  }

  protected quitarInterfazRed(index: number): void {
    this.interfacesRed.removeAt(index);
  }

  protected agregarDireccionIp(interfaz: InterfazRedForm): void {
    this.direccionesIp(interfaz).push(this.crearDireccionIp());
  }

  protected quitarDireccionIp(interfaz: InterfazRedForm, index: number): void {
    this.direccionesIp(interfaz).removeAt(index);
  }

  protected actualizarTipoGestionHardware(): void {
    const control = this.servidorForm.controls.tipoGestionHardware;
    if (this.servidorForm.controls.naturaleza.value === 'Fisico') {
      control.setValidators(Validators.required);
    } else {
      control.clearValidators();
      control.setValue('');
    }
    control.updateValueAndValidity();
  }

  protected guardarServidor(): void {
    const empresaId = this.empresaSeleccionadaId();
    if (empresaId === null || this.guardandoServidor()) {
      return;
    }

    this.actualizarTipoGestionHardware();
    if (this.servidorForm.invalid) {
      this.servidorForm.markAllAsTouched();
      return;
    }

    this.guardandoServidor.set(true);
    this.errorServidor.set(null);
    this.mensajeServidor.set(null);
    const formValue = this.servidorForm.getRawValue();
    this.empresasService
      .crearServidor(empresaId, {
        ...formValue,
        tipoGestionHardware:
          formValue.naturaleza === 'Fisico' ? formValue.tipoGestionHardware : '',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.guardandoServidor.set(false);
          this.mostrarFormularioServidor.set(false);
          this.reiniciarFormularioServidor();
          this.mensajeServidor.set('Servidor agregado correctamente.');
          this.servidores.reload();
        },
        error: () => {
          this.guardandoServidor.set(false);
          this.errorServidor.set('No se pudo agregar el servidor. Inténtalo de nuevo.');
        },
      });
  }

  private reiniciarFormularioServidor(): void {
    this.servidorForm.controls.tipoGestionHardware.clearValidators();
    this.servidorForm.reset({
      nombre: '',
      naturaleza: '',
      plataforma: '',
      versionSistemaOperativo: '',
      nucleos: 0,
      ramGb: 0,
      servidorAnfitrionId: 0,
      tipoGestionHardware: '',
      ipGestionHardware: '',
      datosOpcionales: '',
    });
    this.interfacesRed.clear();
    this.interfacesRed.push(this.crearInterfazRed());
  }

  private crearInterfazRed(): InterfazRedForm {
    return this.fb.group({
      nombre: ['', Validators.required],
      direccionMac: [''],
      direccionesIp: this.fb.array([this.crearDireccionIp()]),
    });
  }

  private crearDireccionIp(): DireccionIpForm {
    return this.fb.group({
      direccion: [''],
    });
  }
}
