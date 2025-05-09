import { C } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { parse } from 'date-fns';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { iComprobante, iTurno } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { BancosService } from 'src/app/services/bancos.service';
import { InformationService } from 'src/app/services/information.service';
import { ShiftsService } from 'src/app/services/shifts.service';


export interface iBilletesMonedas {
  Monto: number,
  Cantidad: number,
  Resultado: number
}


@Component({
  selector: 'app-close-shift',
  standalone: true,
  imports: [importaciones],
  templateUrl: './close-shift.component.html',
  styleUrl: './close-shift.component.scss'
})
export class CloseShiftComponent {
  @ViewChild('miInput') miInput!: ElementRef;

  constructor(
    private alertaService: AlertServiceService,
    private fb: FormBuilder,
    private bancosSservice: BancosService,
    private informationService: InformationService,
    public turnoService: ShiftsService,
    private dialogRef: MatDialogRef<CloseShiftComponent>

  ) {

    // if (turnoService.isOpen !== undefined) {


    // }
    this.getTurnoOpen();

  }



  userLocal: any | undefined;
  miFormulario: FormGroup = this.fb.group({
    idTurno: this.fb.control(null),
    baseInicial: this.fb.control(0, Validators.required),
    fechaApertura: this.fb.control(null, Validators.required),
    fechaCierre: this.fb.control(null),
    vEfc: this.fb.control(0),
    vT: this.fb.control(0),
    vTtrasf: this.fb.control(0),
    devolucion: this.fb.control(0),
    retiroEfectivo: this.fb.control(0),
    totalTurno: this.fb.control(0),
    dineroEsperadoCaja: this.fb.control(0),
    dineroRealEnCaja: this.fb.control(0),
    isOpen: this.fb.control(true),
    idUsuario: this.fb.control(null),
    idSucursal: this.fb.control(null),
    comentario: this.fb.control(""),
    numeroComprobante: this.fb.control(""),
    montoComprobante: this.fb.control(0),
    faltante: this.fb.control(0),
    tickets: this.fb.control(null),
    denominacion: this.fb.group({
      d2000: this.fb.control(0),
      d1000: this.fb.control(0),
      d500: this.fb.control(0),
      d200: this.fb.control(0),
      d100: this.fb.control(0),
      d50: this.fb.control(0),
      d25: this.fb.control(0),
      d10: this.fb.control(0),
      d5: this.fb.control(0),
      d1: this.fb.control(0),
    })
  });
  dateNow: any = new Date();
  turnoOpen!: iTurno | undefined;
  dataListComprobantes: iComprobante[] = [];
  totalMontoTickets: number = 0;



  buscarMonto(denominacion: number) {
    return this.dataListBilletesMonedas.find(c => c.Monto == denominacion)?.Cantidad;
  }

  setDenominacionFormulario() {
    this.miFormulario.patchValue({
      denominacion: {
        d2000: this.buscarMonto(2000),
        d1000: this.buscarMonto(1000),
        d500: this.buscarMonto(500),
        d200: this.buscarMonto(200),
        d100: this.buscarMonto(100),
        d50: this.buscarMonto(50),
        d25: this.buscarMonto(25),
        d10: this.buscarMonto(10),
        d5: this.buscarMonto(5),
        d1: this.buscarMonto(1)
      }
    })
  }



  create() {
    this.alertaService.ShowLoading();
    this.setDenominacionFormulario();
    if (this.turnoService.isOpen == undefined) {
      //Abrir turno
      this.miFormulario.patchValue({
        idSucursal: this.informationService.idSucursal,
        idUsuario: this.informationService.idUsuario,
        baseInicial: this.resultadoMontoConteoBilletes,
        denominacion: this.dataListBilletesMonedas
      }
      );
      this.turnoService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
        if (data.status) {
          this.alertaService.successAlert(data.message)
          this.turnoService.isOpen = data.data;
          this.turnoOpen = this.turnoService.isOpen;
          let userLocal = localStorage.getItem('user');
          if (userLocal != undefined && userLocal != null) {
            this.userLocal = JSON.parse(userLocal);
            this.userLocal.data.idTurno = data.data.idTurno;
            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(this.userLocal))
          }


          this.closeModal();
        } else {
          this.alertaService.errorAlert(data.message);
        }
      });

    } else {
      //Cerrar turno
      this.miFormulario.patchValue({
        idSucursal: this.informationService.idSucursal,
        idUsuario: this.informationService.idUsuario,
        tickets: this.dataListComprobantes,
        idTurno: this.turnoService.isOpen.idTurno,
        baseInicial: this.turnoService.isOpen.baseInicial,
        fechaApertura: this.turnoService.isOpen.fechaApertura,
        dineroEsperadoCaja: (this.turnoService.isOpen.baseInicial + this.turnoService.isOpen.resumen.vefec + this.turnoService.isOpen.resumen.vt + this.turnoService.isOpen.resumen.vtransf),
        dineroRealEnCaja: (this.totalMontoTickets + this.resultadoMontoConteoBilletes),
        denominacion: this.dataListBilletesMonedas,
        faltante: this.montoFaltante,
        vT: this.turnoOpen?.resumen.vt
      }
      );
      this.turnoService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
        if (data.status) {
          this.alertaService.successAlert(data.message)
          this.turnoService.isOpen = undefined;
          this.turnoOpen = this.turnoService.isOpen;
          this.closeModal();
        }
      })

    }
  }

  getTurnoOpen() {
    this.turnoOpen = this.turnoService.isOpen;
    if (this.turnoOpen != undefined) {
      this.montoFaltante = (this.turnoOpen!.baseInicial + this.turnoOpen!.resumen.vefec + this.turnoOpen!.resumen.vtransf + this.turnoOpen!.resumen.vt + this.totalMontoTickets);
    }

    this.turnoService.getTurnoActual(this.informationService.idUsuario).subscribe((data: ServiceResponse) => {
      if (data.statusCode == 200) {
        this.turnoOpen = data.data;
        this.turnoService.isOpen = this.turnoOpen;
        this.montoFaltante = (this.turnoOpen!.baseInicial + this.turnoOpen!.resumen.vefec + this.turnoOpen!.resumen.vtransf + this.turnoOpen!.resumen.vt + this.totalMontoTickets);
        this.alertaService.hideLoading();
      }})
      
  }

  dataListBilletesMonedas: iBilletesMonedas[] = [
    { Monto: 2000, Cantidad: 0, Resultado: 0 },
    { Monto: 1000, Cantidad: 0, Resultado: 0 },
    { Monto: 500, Cantidad: 0, Resultado: 0 },
    { Monto: 200, Cantidad: 0, Resultado: 0 },
    { Monto: 100, Cantidad: 0, Resultado: 0 },
    { Monto: 50, Cantidad: 0, Resultado: 0 },
    { Monto: 25, Cantidad: 0, Resultado: 0 },
    { Monto: 10, Cantidad: 0, Resultado: 0 },
    { Monto: 5, Cantidad: 0, Resultado: 0 },
    { Monto: 1, Cantidad: 0, Resultado: 0 },
  ]
  resultadoMontoConteoBilletes: number = 0;
  montoFaltante: number = 0;

  calcularBillete(index: number, monto: number, event: any) {
    let cant = parseInt(event.target.value);
    this.dataListBilletesMonedas[index].Resultado = (monto * cant);
    this.dataListBilletesMonedas[index].Cantidad = cant;
    this.dataListBilletesMonedas.forEach((c, indice) => {
      if (indice == index) {
        if (cant == 0 || cant == undefined) {
          c.Cantidad, c.Resultado = 0;
        }
      }
    })
    this.calcularMontoFaltante();
  }


  addComprobante() {
    if (this.miFormulario.value.montoComprobante != 0 && this.miFormulario.value.numeroComprobante != '') {
      this.dataListComprobantes.push({ numeracion: this.miFormulario.value.numeroComprobante, monto: this.miFormulario.value.montoComprobante })
      this.miFormulario.patchValue({ montoComprobante: 0, numeroComprobante: '' })
      this.totalMontoTickets = this.dataListComprobantes.reduce((acumulador, valorActual) => { return (acumulador + valorActual.monto) }, 0)
      this.miInput.nativeElement.focus();
      this.calcularMontoFaltante();
    } else {
      this.alertaService.warnigAlert("los campos numero de ticket y monto estan vacios..")
    }
  }

  removeTicket(index: number, monto: number) {
    this.totalMontoTickets -= monto;
    this.dataListComprobantes.splice(index, 1);
    this.calcularMontoFaltante();
  }
  calcularMontoFaltante() {
    this.resultadoMontoConteoBilletes = this.dataListBilletesMonedas.reduce((resultado, monto) => resultado + monto.Resultado, 0);
    if (this.turnoOpen != undefined) {
      if (this.resultadoMontoConteoBilletes == 0) {
        this.montoFaltante = (this.turnoOpen.baseInicial + this.turnoOpen.resumen.vefec + this.turnoOpen.resumen.vtransf + this.turnoOpen.resumen.vt) - this.totalMontoTickets;
      } else {
        this.montoFaltante = (this.turnoOpen.baseInicial + this.turnoOpen.resumen.vefec + this.turnoOpen.resumen.vtransf + this.turnoOpen.resumen.vt) - (this.resultadoMontoConteoBilletes + this.totalMontoTickets);
      }
      this.miFormulario.patchValue({ comentarion: (this.montoFaltante == 0 ? 'El turno cuadro' : '') })
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
