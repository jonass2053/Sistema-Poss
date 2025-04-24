import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { MsjService } from 'src/app/Core/utilities/msj.service';
import { iMoneda, iPago } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { AlmacenService } from 'src/app/services/almacen.service';
import { FacturaService } from 'src/app/services/factura.service';
import { ImpuestosService } from 'src/app/services/impuestos.service';
import { InformationService } from 'src/app/services/information.service';
import { MarcasService } from 'src/app/services/marcas.service';
import { ModelosService } from 'src/app/services/modelos.service';
import { PagosService } from 'src/app/services/pagos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { PayComponent } from './pay/pay.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  constructor(
    private fb: FormBuilder,
    private alertaService: AlertServiceService,
    private msjService: MsjService,
    private pagoService: PagosService,
    private impuestoService: ImpuestosService,
    private almacenService: AlmacenService,
    private usuarioService: UsuarioService,
    private marcaService: MarcasService,
    private modeloService: ModelosService,
    private informationService: InformationService,
    private facturaService: FacturaService,
    private router : Router

  ) {

    this.getAll();
    this.moneda = this.usuarioService.usuarioLogueado.data.sucursal.empresa.moneda;
  }
  dialog = inject(MatDialog);
  moneda!: iMoneda;
  cargando: boolean = false;
  sinRegistros: boolean = false;
  dataList: iPago[] = [];
  sinRegistrosTxt: String = "No se ha encontrado ningun registro."
  displayedColumns: string[] = ['idPago', 'cliente', 'noDocumento', 'tipoDocumento', 'fecha', 'cuenta','monto', 'acciones'];




  async delete(id: any) {
    if (await this.alertaService.questionDelete()) {
      this.alertaService.ShowLoading();
      this.pagoService.delete(id).subscribe(((data: ServiceResponse) => {
        if (data.status) {
          this.alertaService.successAlert(data.message);
          this.getAll();
        }
        else {
          this.alertaService.errorAlert(data.message)
        }
      }))
    }
  }

  getAll() {
    // this.alertaService.ShowLoading();
    this.pagoService.getAll(this.informationService.idSucursal).subscribe((data: ServiceResponse) => {
      this.dataList = data.data;
      // this.alertaService.hideLoading();
    })
  }


  editar(pago: any) {
    this.pagoService.facturaPagar = pago.facturaObj;
    this.pagoService.pagoForEdit = pago;
    var ref = this.dialog.open(PayComponent, { hasBackdrop: true })
    ref.beforeClosed().subscribe(c => {
      this.getAll();
      this.pagoService.pagoForEdit.idPago = 0;
    })
  }


  getAllFilter(event: any) {
    const filtro = (event.target as HTMLInputElement).value;
    if (filtro == ""){
      this.getAll();
    }
    else{
      this.cargando = true;
      this.pagoService.getAllFilter(filtro, this.informationService.idSucursal).subscribe((data: any) => {
        this.dataList = data.data;
      })
    }
  }


  showLoading() {
    this.cargando = this.cargando === true ? false : true;
  }
newPay(){
this.router.navigate(['/payment/newpay']);
}

}
