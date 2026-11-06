import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import { UsuariosService } from '../../data-access/usuarios.service';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil {
  protected readonly auth = inject(AuthService);
  protected readonly perfil = inject(UsuariosService).obtenerPerfil(() => this.auth.user()?.id);

  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly usuarios = inject(UsuariosService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly saving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly form = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    effect(() => {
      const usuario = this.perfil.value();
      if (usuario) {
        this.form.patchValue({ nombre: usuario.nombre, email: usuario.email });
      }
    });
  }

  protected guardar(): void {
    const user = this.auth.user();
    if (!user || this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.usuarios
      .actualizarPerfil(user.id, this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.auth.updateUserProfile(this.form.getRawValue());
          this.successMessage.set('Tu perfil se actualizó correctamente.');
          this.saving.set(false);
          this.perfil.reload();
        },
        error: () => {
          this.errorMessage.set('No se pudo actualizar tu perfil. Inténtalo de nuevo.');
          this.saving.set(false);
        },
      });
  }
}
