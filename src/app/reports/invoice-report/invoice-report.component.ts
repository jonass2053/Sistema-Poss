import { Component, Input, OnInit } from '@angular/core';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { iFactura, iMoneda } from 'src/app/interfaces/iTermino';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-invoice-report',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './invoice-report.component.html',
  styleUrl: './invoice-report.component.scss'
})
export class InvoiceReportComponent {
  @Input() factura!: iFactura;
  constructor(private usuarioService : UsuarioService){
        this.moneda = this.usuarioService.usuarioLogueado.data.sucursal.empresa.moneda;
  }
    moneda! : iMoneda

}
