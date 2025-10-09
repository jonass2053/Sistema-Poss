import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { iContactoPos, iDetalleFactura, iDetalleRecepcion, iFactura } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { FacturaService } from 'src/app/services/factura.service';
import { InformationService } from 'src/app/services/information.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-recepcion-mercancia',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './recepcion-mercancia.component.html',
  styleUrl: './recepcion-mercancia.component.scss'
})
export class RecepcionMercanciaComponent {
  readonly dialogRef = inject(MatDialogRef<RecepcionMercanciaComponent>);
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private alertService: AlertServiceService, private facturaService: FacturaService, private fb: FormBuilder, private information : InformationService) {
    this.getById();


  }


  getById() {
    this.alertService.ShowLoading();
    this.facturaService.getById(this.data).subscribe((Response: ServiceResponse) => {
      if (Response.status) {
        this.alertService.hideLoading();
        this.ordenCompra = Response.data;
        this.fechaServer = Response.dateNow;
        this.ordenCompra.detalle.forEach((detalle: iDetalleFactura, index) => {
          this.montos.push({ idDetalle: detalle.idDetalleFactura, montoRecibido: 0, montoRestante: 0, estado: 3 })
          this.ordenCompra.detalle[index].montoProceso = { idDetalle: detalle.idDetalleFactura, montoRecibido: 0, montoRestante: 0, estado: 3 }
          this.count = this.ordenCompra.detalle.length + 1;

        });



        //sertiar la cabecera de la peticion
        this.miFormulario.patchValue({ idFactura: this.ordenCompra.idFactura, fechaRecepcion: this.fechaServer })
      }
      this.sumarTotalesInserDetalle();
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }




  miFormulario: FormGroup = this.fb.group({
    idRecepcion: this.fb.control(null),
    idFactura: this.fb.control("", Validators.required),
    fechaRecepcion: this.fb.control(""),
    observaciones: this.fb.control(""),
    detalles: this.fb.control(null),
    idSucursal : this.fb.control(null),
    idEmpresa : this.fb.control(null)
  });

  detalles: iDetalleRecepcion[] = [];
  fechaServer!: Date;
  contacto!: iContactoPos;
  ordenCompra!: iFactura;
  itemsCompletos: number = 0;
  itemsParciales: number = 0;
  itemsPendientes: number = 0;
  montos: { idDetalle: number | any, montoRecibido: number, montoRestante: number, estado: number }[] = [];
  indexFacturaPorPagar: number = 0;
  montoResult: number = 0;
  montoPendiente: number = 0;
  montoDeudor: number = 0;
  montoValidate: boolean = true;
  count: number = 0;

  SumarMontoTotalPagado(event: any) {

    let valor = (event.target as HTMLInputElement).value === "" ? '0' : (event.target as HTMLInputElement).value;
    // validacion para que el valor ingresado no sea mayor que el monto de la fila
    this.montos[this.indexFacturaPorPagar].idDetalle = this.ordenCompra.detalle[this.indexFacturaPorPagar].idDetalleFactura;
    if (valor === '0') {
      this.montos[this.indexFacturaPorPagar].montoRecibido = 0;
      this.montos[this.indexFacturaPorPagar].montoRestante = 0;
    } else {
      this.montos[this.indexFacturaPorPagar].montoRecibido = parseFloat(valor);
      this.montos[this.indexFacturaPorPagar].montoRestante = this.ordenCompra.detalle[this.indexFacturaPorPagar].cantidad - this.montos[this.indexFacturaPorPagar].montoRecibido;
    }
    this.montoResult = 0;
    this.montoPendiente = 0;
    this.montos.forEach(element => {
      this.montoResult += element.montoRecibido;
      this.montoPendiente = this.montoDeudor - this.montoResult;

      //Total de elementos completados de la list
      if (element.montoRecibido == this.ordenCompra.detalle.find(c => c.idDetalleFactura == element.idDetalle)?.cantidad) {
        element.estado = 1;
      }
      if (element.montoRecibido < this.ordenCompra.detalle.find(c => c.idDetalleFactura == element.idDetalle)?.cantidad!) {
        element.estado = 2;
      }
      if (element.montoRecibido == 0) {
        element.estado = 3;
      }
      console.log(this.count)
      this.count--;
      if (this.count > 0) {
      }

    });
    this.montoValidate = true;
    this.ordenCompra.detalle[this.indexFacturaPorPagar].montoProceso = this.montos[this.indexFacturaPorPagar];

    // this.ordenCompra.detalle[this.indexFacturaPorPagar].montoProceso.montoRestante = (this.ordenCompra.detalle[this.indexFacturaPorPagar].cantidad - this.ordenCompra.detalle[this.indexFacturaPorPagar]?.montoProceso?.montoRecibido);

    //  console.log(this.montos)
    this.sumarTotalesInserDetalle();


  }


  sumarTotalesInserDetalle() {
    this.detalles = [];
    this.itemsCompletos = 0;
    this.itemsParciales = 0;
    this.itemsPendientes = 0;
    this.ordenCompra.detalle.forEach(c => {
      switch (c.montoProceso.estado) {
        case 1: this.itemsCompletos++;
          break;
        case 2: this.itemsParciales++;
          break;
        case 3: this.itemsPendientes++;
          break;
      }

      this.detalles.push({ cantidadRecibida: c.montoProceso.montoRecibido, idDetalleFactura: c.idDetalleFactura });

    })


  }


  getIndex(index: any) {
    this.indexFacturaPorPagar = index;
  }

  validateCanRecibida(): boolean {
    if (this.montos.filter(c => c.montoRecibido).length == 0) {
      return false;
    }
    return true;
  }



  //insert
  insert() {
   this.setMiFormulario();
    if (this.validateCanRecibida() == true) {
      this.facturaService.insertRecepcion(this.miFormulario.value).subscribe((result: ServiceResponse) => {
        if (result.status) {
          this.alertService.successAlert(result.message);
        } else {
          this.alertService.successAlert(result.message);
        }
      })
    }else{
      this.alertService.errorAlert("No se pude guardar sin antes recibir la emrcancia...")
    }


  }



setMiFormulario(){
 this.miFormulario.patchValue({detalles : this.detalles, idEmpresa :  this.information.idEmpresa, idSucursal : this.information.idSucursal});
}




  //update





  //delete




  //get




  save() {
    this.insert();
  }
}
