import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { MsjService } from 'src/app/Core/utilities/msj.service';
import { ValidatorFormService } from 'src/app/Core/utilities/validator-form.service';
import { iTermino } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { TerminosService } from 'src/app/services/terminos.service';

@Component({
  selector: 'app-payment-terms',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './payment-terms.component.html',
  styleUrl: './payment-terms.component.scss'
})
export class PaymentTermsComponent {
  constructor(
    private fb : FormBuilder, 
    private validatorForm : ValidatorFormService,
    private terminoService : TerminosService,
    private alertaService : AlertServiceService,
    private msjService : MsjService
  ){

    this.getAll();
  }
  miFormulario : FormGroup = this.fb.group(
    {
      idTermino : this.fb.control(null),
      nombre : this.fb.control("", Validators.required),
      dias : this.fb.control("", Validators.required),
    });
    dataList: iTermino[] = [];
    cargando : boolean = false;
    sinRegistros : boolean = false;
    sinRegistrosTxt : string =this.msjService.msjSinRegistros;
    color: ThemePalette = 'accent';
    displayedColumns: string[] = ['idTermino', 'nombre', 'dias', 'predeterminado', 'acciones'];



  
    insert() {
      this.alertaService.ShowLoading();
      this.terminoService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
        setTimeout(() => {
          this.alertaService.successAlert(data.message);
          if (data.status) {
            this.resetForm();
            this.getAll();
          }
        }, 1000);
      })
    }
     async delete(id : number) 
    {
      if(await this.alertaService.questionDelete())
        {
          this.alertaService.ShowLoading();
          this.terminoService.delete(id).subscribe(((data: ServiceResponse)=>
          {
              if(data.status)
                {
                  this.alertaService.successAlert(data.message);
                  this.getAll();
                  this.resetForm();
                }
                else
                {
                  this.alertaService.errorAlert(data.message)
                }
          }))
        }

     }
    
    update() {
      this.alertaService.ShowLoading();
      this.terminoService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
        setTimeout(() => {
          this.alertaService.successAlert(data.message);
          data.status ? this.resetForm : '';
          this.getAll();
        }, 1000);
      })
    }
  
    save() {
      if (this.miFormulario.valid) {
        console.log(this.miFormulario.value)
        this.miFormulario.get('idTermino')?.value === null ? this.insert() : this.update()
      }
    }
  
    getAll() {
      this.cargando=true;
      this.terminoService.getAll().subscribe((data: any) => {
        this.dataList = data.data;
        (this.dataList.length>0) ? this.sinRegistros=false : this.sinRegistros=true;
        this.cargando=false;
        console.log(data)
      })
    }
  
    editar(termino: iTermino) {
      this.miFormulario.patchValue(
        { 'idTermino': termino.idTermino , 'nombre': termino.nombre, 'dias' : termino.dias })
      console.log(this.miFormulario.value)
    }
  
    resetForm() {
      this.miFormulario.reset();    }

    setPlazoDefault(id: number) {
      // this.alertaService.ShowLoading();
      this.terminoService.setDefautlTermino(id).subscribe((data: ServiceResponse) => {
        setTimeout(() => {
          // this.alertaService.successAlert(data.message);
          data.status ? this.resetForm : '';
          this.getAll();
          // this.closeModal();
        }, 1000);
      })
    }
}
