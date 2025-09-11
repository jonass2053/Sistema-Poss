import { Component, Inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { BoxServiceService } from 'src/app/services/box-service.service';
import { InformationService } from 'src/app/services/information.service';

@Component({
  selector: 'app-cash-register',
  standalone: true,
  imports: [importaciones],
  templateUrl: './cash-register.component.html',
  styleUrl: './cash-register.component.scss'
})
export class CashRegisterComponent {
  cashRegisterForm: FormGroup;

  cashiers = [
    { value: 'Juan Pérez', label: 'Juan Pérez' },
    { value: 'María García', label: 'María García' },
    { value: 'Carlos López', label: 'Carlos López' },
    { value: 'Ana Martínez', label: 'Ana Martínez' }
  ];

  shifts = [
    { value: 'Mañana', label: 'Mañana (08:00 - 16:00)' },
    { value: 'Tarde', label: 'Tarde (16:00 - 23:00)' },
    { value: 'Noche', label: 'Noche (23:00 - 08:00)' }
  ];

  constructor(
    private fb: FormBuilder,
    private cajaService: BoxServiceService,
    private informations: InformationService,
    private alertaService: AlertServiceService,
    public dialogRef: MatDialogRef<CashRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.cashRegisterForm = this.fb.group({
      id: this.fb.control(null),
      nombre: this.fb.control('', Validators.required),
      pin: this.fb.control(null, Validators.required),
      idSucursal: this.fb.control(null)
    });


    if (cajaService.cajaEdit != undefined) {
      this.cashRegisterForm.reset(cajaService.cajaEdit);
    }
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }


  save() {
    if (this.cajaService.cajaEdit == undefined) {
      this.insert();
    } else {
      this.update();
    }

  }


  insert() {
    this.cashRegisterForm.patchValue({ idSucursal: this.informations.idSucursal });
    this.cajaService.insert(this.cashRegisterForm.value).subscribe((result: ServiceResponse) => {
      if (result.status) {
        this.alertaService.successAlert(result.message);
         this.resetForm();
        this.dialogRef.close(this.cashRegisterForm.value);
      } else {
        this.alertaService.errorAlert(result.message);
      }
    })
  }

  update() {
    this.cajaService.update(this.cashRegisterForm.value).subscribe((result: ServiceResponse) => {
      if (result.status) {
        this.alertaService.successAlert(result.message);
        this.resetForm();
       this.dialogRef.close(this.cashRegisterForm.value);
      } else {
        this.alertaService.errorAlert(result.message);
      }
    })
  }

  resetForm() {
    this.cashRegisterForm.reset();
    this.cajaService.cajaEdit = undefined;
  }
  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.cashRegisterForm.valid) {
      // this.dialogRef.close(this.cashRegisterForm.value);
    }
  }
}
