import { Component, Inject } from '@angular/core';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { iTurno } from 'src/app/interfaces/iTermino';
import { LoaderComponent } from '../../loader/loader.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BoxServiceService } from 'src/app/services/box-service.service';
import { ShiftsService } from 'src/app/services/shifts.service';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { ButtonsComponent } from '../../buttons/buttons.component';
import { NodataComponent } from '../../nodata/nodata.component';


export interface CashRegister {
  descripcion: string
  comentario: string
  baseInicial: number
  dineroEsperadoEnCaja: number
  dineroRealEnCaja: number
  fechaApertura: Date
  fechaCierre: Date
  entradaCaja: number
  salidaCaja: number
  vefec: number // Ventas en efectivo
  vt: number // Ventas totales
  vtransf: number // Ventas con transferencia
  cajero: string
}



@Component({
  selector: 'app-shift-list',
  standalone: true,
  imports: [
    importaciones,
    LoaderComponent,
    ButtonsComponent,
    NodataComponent
  ],
  templateUrl: './shift-list.component.html',
  styleUrl: './shift-list.component.scss'
})
export class ShiftListComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ShiftListComponent>,
    private turnoService: ShiftsService
  ) {
    this.getTurnos();
  }



  displayedColumns: string[] = [
    'ID',
    'DESCRIPCION',
    'COMENTARIO',
    'BASEINICIAL',
    'DINEROESPERADOENCAJA',
    'DINEROREALENCAJA',
    'FECHAAPERTURA',
    'FECHACIERRE',
    'ENTRADACAJA',
    'SALIDACAJA',
    'VEFECT',
    'VT',
    'VTRANSF',
  ];

  loading: boolean = false;
  dataListTurno: iTurno[] = [];

  getTurnos() {
    this.loading = true;
    this.turnoService.getAllByIdCaja(this.data.idCaja).subscribe((response: ServiceResponse) => {
      if (response.status) {
        this.dataListTurno = response.data;
        this.loading = false;
      }
    })
  }

  exportar() {
  this.loading = true;
  this.turnoService.getAllByIdCajaExportar(this.data.idCaja).subscribe({
    next: (blob: Blob) => {
      this.loading = false;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TurnosCaja${this.data.idCaja}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    },
    error: () => {
      this.loading = false;
    }
  });
}



}
