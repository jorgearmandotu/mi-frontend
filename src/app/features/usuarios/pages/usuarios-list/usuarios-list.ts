import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UsuariosService } from '../../data-access/usuarios.service';

@Component({
  selector: 'app-usuarios-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.scss',
})
export class UsuariosList {
  protected readonly usuarios = inject(UsuariosService).listar();
}
