import { Component, Inject, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { iDetalleRecepcion } from 'src/app/interfaces/iTermino';
import { NodataComponent } from '../nodata/nodata.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FacturaService } from 'src/app/services/factura.service';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';

@Component({
  selector: 'app-recepcion-detalle',
  standalone: true,
  imports: [
    importaciones,
    NodataComponent
  ],
  templateUrl: './recepcion-detalle.component.html',
  styleUrl: './recepcion-detalle.component.scss'
})
export class RecepcionDetalleComponent {

  readonly dialogRef = inject(MatDialogRef<RecepcionDetalleComponent>);
  dataSource = new MatTableDataSource<iDetalleRecepcion>();
  displayedColumns: string[] = ['CantidadRecibida', 'CantidadSolicitada', 'CantidadFaltante', 'CantidadRestante'];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private facturaService : FacturaService, private alertaService : AlertServiceService){
    this.getDetalleOrden(data);
  }

  getDetalleOrden(idOrden : number){
    this.alertaService.ShowLoading();
    this.facturaService.getByDetalleByIdRecepciones(idOrden).subscribe((result : ServiceResponse)=>{
      if(result.status){
        this.dataSource.data=result.data;
        this.alertaService.hideLoading();
      }
    })
  }
} 
