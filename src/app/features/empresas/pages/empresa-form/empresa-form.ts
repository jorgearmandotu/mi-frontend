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
import { Router, RouterLink } from '@angular/router';
import { EmpresasService } from '../../data-access/empresas.service';

type SedeForm = FormGroup<{ direccion: FormControl<string> }>;

@Component({
  selector: 'app-empresa-form',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './empresa-form.html',
  styleUrl: './empresa-form.scss',
})
export class EmpresaForm {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly empresasService = inject(EmpresasService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly saving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly form = this.fb.group({
    nit: ['', Validators.required],
    nombre: ['', Validators.required],
    sedes: this.fb.array([this.createSede()]),
    habilitada: [true],
  });

  protected get sedes(): FormArray<SedeForm> {
    return this.form.controls.sedes;
  }

  protected agregarSede(): void {
    this.sedes.push(this.createSede());
  }

  protected quitarSede(index: number): void {
    this.sedes.removeAt(index);
  }

  protected guardar(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    this.empresasService
      .crear(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/empresas']),
        error: () => {
          this.errorMessage.set('No se pudo guardar la empresa. Inténtalo de nuevo.');
          this.saving.set(false);
        },
      });
  }

  private createSede(): SedeForm {
    return this.fb.group({
      direccion: ['', Validators.required],
    });
  }
}
