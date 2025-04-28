import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { iBanco } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { BancosService } from 'src/app/services/bancos.service';
import { InformationService } from 'src/app/services/information.service';
import { ShiftsService } from 'src/app/services/shifts.service';
interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-open-shift',
  standalone: true,
  imports: [importaciones],
  templateUrl: './open-shift.component.html',
  styleUrl: './open-shift.component.scss'
})
export class OpenShiftComponent {
  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];

  datalistBancos: iBanco[] = [];
  constructor(
    private bancosSservice: BancosService,
    private informationService: InformationService,
    private fb: FormBuilder,
    private turnoService: ShiftsService,
    private alertaService: AlertServiceService
  ) {
    this.getAllBancos();
  }


  miFormulario: FormGroup = this.fb.group({
    idTurno: this.fb.control(null),
    baseInicial: this.fb.control(0),
    fechaApertura: this.fb.control(null),
    fechaCierre: this.fb.control(null),
    vEfc: this.fb.control(0),
    vTc: this.fb.control(0),
    vTd: this.fb.control(0),
    vTtrasf: this.fb.control(0),
    devolucion: this.fb.control(0),
    retiroEfectivo: this.fb.control(0),
    totalTurno: this.fb.control(0),
    dineroEsperadoCaja: this.fb.control(0),
    dineroRealEnCaja: this.fb.control(0),
    isOpen: this.fb.control(true),
    idUsuario: this.fb.control(null),
    idSucursal: this.fb.control(null),
  });

  getAllBancos() {
    this.bancosSservice.getAll(this.informationService.idSucursal).subscribe((data: ServiceResponse) => {
      if (data.status) {
        this.datalistBancos = data.data;
      }
    })
  }

  create() {

    this.miFormulario.patchValue(
      {
        idSucursal: this.informationService.idSucursal,
        idUsuario: this.informationService.idUsuario
      }
    );
    if (this.miFormulario.valid) {
      this.turnoService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
        if (data.status) {
          this.alertaService.successAlert(data.message)
        }
      })
    }
  }

}

