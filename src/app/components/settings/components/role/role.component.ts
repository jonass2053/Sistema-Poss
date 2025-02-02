import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { ValidatorFormService } from 'src/app/Core/utilities/validator-form.service';
import { iRol, ServiceResponse } from 'src/app/interfaces/service-response-login';
import { RolesService } from 'src/app/services/roles.service';





@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent {

  displayedColumns: string[] = ['idRol', 'nombre', 'acciones'];
  // dataSource = ELEMENT_DATA;
  
  constructor(
    private fb: FormBuilder,
    private validatorForm: ValidatorFormService,
    private alertaService: AlertServiceService,
    private rolService: RolesService
  ) {
    this.getAll();
  }
  miFormulario: FormGroup = this.fb.group(
    {
      idRol: this.fb.control(null),
      nombre: this.fb.control("", Validators.required),
    }
  )
  dataList: iRol[] = [];
  cargando : boolean = false;
  sinRegistros : boolean = false;
 
  


  insert() {
    this.alertaService.ShowLoading();
    this.rolService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
      setTimeout(() => {
        this.alertaService.successAlert(data.message);
        if (data.status) {
          this.resetForm();
          this.getAll();
        }
      }, 1000);
    })
  }
   async delete(idRol : number) 
  {
    if(await this.alertaService.questionDelete())
      {
        this.alertaService.ShowLoading();
        this.rolService.delete(idRol).subscribe(((data: ServiceResponse)=>
        {
            if(data.status)
              {
                this.alertaService.successAlert(data.message);
                this.getAll();
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
    this.rolService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
      this.miFormulario.get('idRol')?.value === null ? this.insert() : this.update()
    }
  }

  getAll() {
    this.rolService.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      this.dataList.length>0 ? this.sinRegistros=false : this.sinRegistros=true;
      this.cargando=false;
    })
  }

  editar(rol: iRol) {
    this.miFormulario.patchValue(
      { 'idRol': rol.idRol, 'nombre': rol.nombre })
  }

  resetForm() {
    this.miFormulario.reset();
  }
}
