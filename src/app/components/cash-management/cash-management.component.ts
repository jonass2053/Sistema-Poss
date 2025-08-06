import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxPrintService, PrintOptions } from 'ngx-print';
import { switchAll, switchMap, timeout } from 'rxjs';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { iCash, iCashResumen } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { CashService } from 'src/app/services/cash.service';
import { InformationService } from 'src/app/services/information.service';
import { ShiftsService } from 'src/app/services/shifts.service';

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
  dataList: iCash[] = [];
  cashResumen!: iCashResumen;
  seleccion!: iCash | undefined;
  dateNow: any;

  constructor(
    private fb: FormBuilder,
    private alertas: AlertServiceService,
    private cashService: CashService,
    private informationService: InformationService,
    private printService: NgxPrintService,
    public turnoService : ShiftsService

  ) {
    this.getAll();
    this.getResumen();
  }

  miFormulario: FormGroup = this.fb.group({
    id: this.fb.control(null),
    idTurno: this.fb.control(null),
    fecha: this.fb.control(null),
    ingreso: this.fb.control(false, Validators.required),
    monto: this.fb.control('', Validators.required),
    descripcion: this.fb.control('', Validators.required),
    referencia: this.fb.control('', Validators.required),
    idUsuario: this.fb.control(null),
  });


  selectView(valor: number) {
    switch (valor) {
      case 1:
        this.operaciones = true; this.historial = false; this.resumen = false;
        break;
      case 2:
        this.operaciones = false; this.historial = true; this.resumen = false;
        break;
      default:
        this.operaciones = false; this.historial = false; this.resumen = true;
    }
  }

  getAll() {
    this.cargarFormulario();
    this.cashService.getAll(this.informationService.idSucursal, this.informationService.idTurno).subscribe((data: ServiceResponse) => {
      if (data.status) {
        this.dataList = data.data;
      } else {
        this.alertas.errorAlert(data.message)
      }
    })
  }
  insert() {
    if (this.miFormulario.valid) {
      this.cashService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
        if (data.status) {
          this.alertas.successAlert(data.message);
          this.resetForm();
          this.cargarData();

        } else {
          this.alertas.errorAlert(data.message);
        }
      })
    }


  }

  async delete(id: number) {
    if (await this.alertas.questionDelete()) {
      this.cashService.delete(id).subscribe((data: ServiceResponse) => {
        if (data.status) {
          this.cargarData();
        } else {
          this.alertas.errorAlert(data.message)
        }
      })
    }
  }

  update() {
    if (this.miFormulario.valid) {
      this.cashService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
        if (data.status) {
          this.alertas.successAlert(data.message);
          this.resetForm();
          this.cargarData();
          this.selectView(2);
        } else {
          this.alertas.errorAlert(data.message);
        }
      })
    }
  }

  getResumen() {
    this.cashService.getResumen(this.informationService.idTurno).subscribe((data: ServiceResponse) => {
      if (data.status) {
        this.cashResumen = data.data;
      }
    })
  }

  cargarFormulario() {
    this.miFormulario.patchValue({
      idUsuario: this.informationService.idUsuario,
      idTurno: this.informationService.idTurno
    })
  }

  save() {
    //  this.alertas.ShowLoading();
    this.cargarFormulario();
    if (this.miFormulario.value.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }
  edit(movimiento: iCash) {
    this.miFormulario.reset(movimiento);
    this.selectView(1);
  }

  resetForm() {
    this.miFormulario.reset();
    this.miFormulario.patchValue({ ingreso: false })
  }

  printMe(cash: iCash) {
    this.seleccion = cash;
    this.dateNow = new Date();
    setTimeout(() => {
      const customPrintOptions: PrintOptions = new PrintOptions({
        printSectionId: 'reporte',
        useExistingCss: true,
        printTitle: 'Detalles Solicitud',
        bodyClass: 'printable',
        openNewTab: true,
        previewOnly: false,
        closeWindow: true
      });
      this.printService.print(customPrintOptions);
      this.seleccion = undefined;
    }, 500);

  }


  cargarData() {
    this.getAll();
    this.getResumen();
  }
}
