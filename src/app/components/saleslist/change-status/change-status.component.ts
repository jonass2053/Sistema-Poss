import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { FacturaService } from 'src/app/services/factura.service';

@Component({
  selector: 'app-change-status',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './change-status.component.html',
  styleUrl: './change-status.component.scss'
})
export class ChangeStatusComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private facturaService: FacturaService,
    private alertService: AlertServiceService,
    private dialogReference: MatDialogRef<ChangeStatusComponent>,
    private fb: FormBuilder
  ) {
    this.miFormulario.patchValue({ idDocument: data })
  }

  miFormulario: FormGroup = this.fb.group({
    idStatus: this.fb.control(true),
    idDocument: this.fb.control(false)

  })


  seelctOpcion(idStatus: number) {
    this.miFormulario.patchValue({ idStatus: idStatus });
  }


  saveChange() {
    this.alertService.ShowLoading();
    this.facturaService.changeStatusConduce(this.miFormulario.value.idStatus, this.miFormulario.value.idDocument).subscribe((result: ServiceResponse) => {
      if (result.status) {
        this.dialogReference.close();
        this.alertService.successAlert(result.message);

      }
      else {
        this.alertService.hideLoading();
        this.alertService.errorAlert(result.message);
      }
    })
  }
}
