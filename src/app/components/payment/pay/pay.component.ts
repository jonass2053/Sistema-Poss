import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { iBanco, iMetodoPago, iMoneda } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { BancosService } from 'src/app/services/bancos.service';
import { FacturaService } from 'src/app/services/factura.service';
import { PagosService } from 'src/app/services/pagos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './pay.component.html',
  styleUrl: './pay.component.scss'
})
export class PayComponent {
  constructor(
    private bancoService: BancosService,
    private usuarioService: UsuarioService,
    private facturaService: FacturaService,
    private fb: FormBuilder,
    private pagoService: PagosService,
    private alertas: AlertServiceService,
    public dialogRef: MatDialogRef<PayComponent>,
  ) {
    if (this.usuarioService.usuarioLogueado != undefined) {
      this.moneda = this.usuarioService.usuarioLogueado.data.sucursal.empresa.moneda;
    }
    if (this.pagoService.facturaPagar != null) {
      this.nombreCliente = this.pagoService.facturaPagar.contacto.nombreRazonSocial;
      this.noFactura = this.pagoService.facturaPagar.numeracion;
      this.montoPorPagar = this.pagoService.facturaPagar.montoPorPagar;
      this.miFormulario.patchValue({
        idFactura: this.pagoService.facturaPagar.idFactura,
        idContacto: this.pagoService.facturaPagar.idContacto,
        monto: this.pagoService.facturaPagar.montoPorPagar
      });

      if (this.pagoService.pagoForEdit!==undefined && this.pagoService.pagoForEdit.idPago !== 0) {
        this.montoPagado = this.pagoService.pagoForEdit.monto;
        this.miFormulario.patchValue({
          idPago: this.pagoService.pagoForEdit.idPago,
          idFactura: this.pagoService.facturaPagar.idFactura,
          idContacto: this.pagoService.facturaPagar.idContacto,
          idMetodoPago: this.pagoService.pagoForEdit.idMetodoPago,
          idBanco: this.pagoService.pagoForEdit.idBanco,
          monto: this.pagoService.pagoForEdit.monto,
          notaPago: this.pagoService.pagoForEdit.notaPago,
          noTicket: this.pagoService.pagoForEdit.noTicket,
        });
      }
    }
    this.getBancos();
    this.getMetodoPago();
  }

  miFormulario: FormGroup = this.fb.group({
    idPago: this.fb.control(null),
    idFactura: this.fb.control(null),
    idContacto: this.fb.control(null),
    idMetodoPago: this.fb.control("", Validators.required),
    idBanco: this.fb.control("", Validators.required),
    monto: this.fb.control(0, Validators.required),
    notaPago: this.fb.control(''),
    noTicket: this.fb.control('')
  })

  noFactura: string = '';
  nombreCliente: string = '';
  montoPorPagar: number = 0;
  montoPagado: number = 0;
  dataListBanco: iBanco[] = [];
  dataListMetodoPago: iMetodoPago[] = [];
  moneda!: iMoneda;


  getBancos() {
    this.bancoService.getAll(this.usuarioService.usuarioLogueado.data.sucursal.idSucursal).subscribe((result: ServiceResponse) => { this.dataListBanco = result.data; })
  }
  getMetodoPago() {
    this.facturaService.getAllMetodoPago().subscribe((result: ServiceResponse) => { this.dataListMetodoPago = result.data; })
  }

  selectMetodo(metodo: iMetodoPago) {
    if (metodo.nombre.includes("EFECTIVO"))
      this.miFormulario.patchValue({ idBanco: this.dataListBanco.find(c => c.nombreCuenta.toUpperCase().includes("CAJA"))?.idBanco })
    else
      this.miFormulario.patchValue({ idBanco: "" })
  }

  insert() {
    this.pagoService.insert(this.miFormulario.value).subscribe((result: ServiceResponse) => {
      if (result.statusCode == 200) {
        this.alertas.successAlert(result.message);
        this.closeDialog();
      }
      else
        this.alertas.errorAlert(result.message)
    });
  }

  update() {
    this.pagoService.update(this.miFormulario.value).subscribe((result: ServiceResponse) => {
      if (result.status) {
        this.alertas.successAlert(result.message);
        setTimeout(() => {
          this.closeDialog();
        }, 1000);
      } else {
        this.alertas.errorAlert(result.message);
      }
    })
  }

  delete(idPago: number) {
    this.pagoService.delete(idPago).subscribe((result: ServiceResponse) => {
      if (result.status) {
        this.alertas.successAlert(result.message)
        this.closeDialog();
      }
      else
        this.alertas.errorAlert(result.message)
    })
  }

  save() {
    if (this.miFormulario.valid) {
      this.alertas.ShowLoading();
      this.miFormulario.value.idPago === null ? this.insert() : this.update();
    }
  }

  reset() {
    this.miFormulario.reset();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }


}
