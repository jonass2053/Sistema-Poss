import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { ValidatorFormService } from 'src/app/Core/utilities/validator-form.service';
import { iiMpuesto } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { ImpuestosService } from 'src/app/services/impuestos.service';

@Component({
  selector: 'app-taxes',
  standalone: true,
  imports: [
     importaciones,
     MatDatepickerModule,
     MatInputModule,
     MatFormFieldModule
   ],
   providers: [provideNativeDateAdapter()],
  templateUrl: './taxes.component.html',
  styleUrl: './taxes.component.scss'
})
export class TaxesComponent {
  constructor(
    private fb: FormBuilder,
    private validatorForm: ValidatorFormService,
    private alertaService: AlertServiceService,
    private impuestoService: ImpuestosService
  ) {
    this.getAll();
  }
  miFormulario: FormGroup = this.fb.group(
    {
      idImpuesto: this.fb.control(null),
      nombre: this.fb.control("", Validators.required),
      porcentaje: this.fb.control(0, Validators.required),
      impuestoAcreditable: this.fb.control(false),
      descripcion: this.fb.control("")
    }
  )
  dataList: iiMpuesto[] = [];
  cargando: boolean = false;
  sinRegistros: boolean = false;
  displayedColumns: string[] = ['idImpuesto', 'nombre', 'porcentaje', 'descripccion', 'acciones'];
  editando : boolean = false;

 


  insert() {
    this.alertaService.ShowLoading();
    this.impuestoService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
      setTimeout(() => {
        this.alertaService.successAlert(data.message);
        if (data.status) {
          this.resetForm();
          this.getAll();
        }
      }, 1000);
    })
  }
  async delete(idImpuesto: any) {
    if (await this.alertaService.questionDelete()) {
      this.alertaService.ShowLoading();
      this.impuestoService.delete(idImpuesto).subscribe(((data: ServiceResponse) => {
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

  update() {
    this.alertaService.ShowLoading();
    this.impuestoService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
      setTimeout(() => {
        this.alertaService.successAlert(data.message);
        data.status ? this.resetForm : '';
        this.getAll();
        this.resetForm();
      }, 1000);
    })
  }

  save() {
    if (this.miFormulario.valid) {
      this.miFormulario.get('idImpuesto')?.value === null ? this.insert() : this.update()
    }
  }

  getAll() {
    this.cargando = true;
    this.impuestoService.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      this.dataList.length > 0 ? this.sinRegistros = false : this.sinRegistros = true;
      this.cargando = false;
    })
  }

  editar(impuesto: iiMpuesto) {
    this.editando=true;
    this.miFormulario.patchValue({
     'idImpuesto': impuesto.idImpuesto,
     'nombre': impuesto.nombre,
     'porcentaje': impuesto.porcentaje,
     'impuestoAcreditable': impuesto.impuestoAcreditable,
     'descripcion': impuesto.descripcion
    }
    )
  }

  resetForm() {
    this.miFormulario.reset();
    this.editando=false;
  }

}
