import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { BoxServiceService } from 'src/app/services/box-service.service';
import { InformationService } from 'src/app/services/information.service';
import { PrintServiceService } from 'src/app/services/print-service.service';

@Component({
  selector: 'app-reporte-consolidado',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './reporte-consolidado.component.html',
  styleUrl: './reporte-consolidado.component.scss'
})
export class ReporteConsolidadoComponent {



  constructor(
    private cajaService: BoxServiceService,
    private fb: FormBuilder,
    private informationService: InformationService,
    private alertService: AlertServiceService,
    private prinService: PrintServiceService
  ) {

  }

  miFormulario: FormGroup = this.fb.group({
    desde: this.fb.control(null, Validators.required),
    hasta: this.fb.control(null, Validators.required)

  });

  loading: boolean = false;
  exportar() {
    this.alertService.ShowLoading();
    this.loading = true;
    this.setFormatDate();
    this.cajaService.reporteConsolidadoExportar(this.informationService.idSucursal, this.miFormulario.value.desde, this.miFormulario.value.hasta).subscribe({
      next: (blob: Blob) => {
        this.loading = false;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ReporteConsolidado.csv`;
        document.body.appendChild(a);
        this.alertService.hideLoading();
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  printReporteConsolidado() {
    this.alertService.ShowLoading();
    this.setFormatDate();
    this.cajaService.reporteConsolidado(this.informationService.idSucursal, this.miFormulario.value.desde, this.miFormulario.value.hasta).subscribe((result: ServiceResponse) => {
      if (result.status&& result.data!=undefined) {
        this.alertService.hideLoading();
        this.prinService.printReportConsolidadoCajas(this.miFormulario.value.desde, this.miFormulario.value.hasta, result.dateNow, result.data);
      }
    })
  }

  //  Metodo para darle formato a la fecha antes de enviarla
  setFormatDate() {
    let desdeOri: Date | null = this.miFormulario.value.desde ? new Date(this.miFormulario.value.desde) : null;
    let hastaOri: Date | null = this.miFormulario.value.hasta ? new Date(this.miFormulario.value.hasta) : null;
    if (desdeOri != undefined && hastaOri != undefined) {
      this.miFormulario.patchValue({
        desde: `${desdeOri?.getFullYear()}-${(desdeOri?.getMonth()!) + 1}-${desdeOri?.getDate()}`,
        hasta: `${hastaOri?.getFullYear()}-${(hastaOri?.getMonth()!) + 1}-${hastaOri?.getDate()}`
      })

    }
  }
}
