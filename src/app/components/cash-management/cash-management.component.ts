import { Component } from '@angular/core';
import { switchAll, switchMap } from 'rxjs';
import { importaciones } from 'src/app/Core/utilities/material/material';

@Component({
  selector: 'app-cash-management',
  standalone: true,
  imports: [importaciones],
  templateUrl: './cash-management.component.html',
  styleUrl: './cash-management.component.scss'
})
export class CashManagementComponent {

  operaciones: boolean = true;
  historial: boolean = false;
  resumen: boolean = false;

  selectView(valor: number) {
    switch (valor) {
      case 1:
        this.operaciones=true; this.historial = false; this.resumen=false;
        break;
      case 2:
        this.operaciones=false; this.historial = true; this.resumen=false;
        break;
      default:
        this.operaciones=false; this.historial = false; this.resumen=true;
    }
  }

}
