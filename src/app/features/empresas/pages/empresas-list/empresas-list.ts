import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmpresasService } from '../../data-access/empresas.service';

@Component({
  selector: 'app-empresas-list',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './empresas-list.html',
  styleUrl: './empresas-list.scss',
})
export class EmpresasList {
  protected readonly empresas = inject(EmpresasService).listar();
}
