import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { ValidatorFormService } from 'src/app/Core/utilities/validator-form.service';
import { IUsuario } from 'src/app/interfaces/i-usuario';
import { iRol, ServiceResponse } from 'src/app/interfaces/service-response-login';
import { RolesService } from 'src/app/services/roles.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TaxesComponent } from "../taxes/taxes.component";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    importaciones,
    TaxesComponent
],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  constructor(
    private fb : FormBuilder,
    private validatorForm : ValidatorFormService,
    private alertaService : AlertServiceService,
    private usuarioService : UsuarioService ,
    private rolService : RolesService
  ){
    this.getAllRoles();
    this.getAll();
  }
  miFormulario : FormGroup = this.fb.group(
    {
      idUsuario: this.fb.control(null),
      nombre : this.fb.control("", Validators.required),
      apellidos : this.fb.control("", Validators.required),
      correo : this.fb.control("", [Validators.email, Validators.required]),
      idRol : this.fb.control("", Validators.required),
      contrasena : this.fb.control("")
    }

  )
  editando : boolean = false;
  cargando : boolean = false;
  displayedColumns: string[] = ['idUsuario', 'nombre', 'correo', 'acciones'];


  dataList:IUsuario[] = [];
  roles : iRol[]=[];

  getAllRoles()
  {
    this.rolService.getAll().subscribe((data: ServiceResponse)=>
    {
      this.roles = data.data;
      console.log(data)
    })
  }





  insert() {
    this.alertaService.ShowLoading();
    console.log(this.miFormulario.value)
    this.usuarioService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
    console.log(data)
      setTimeout(() => {
        this.alertaService.successAlert(data.message);
        if (data.status) {
          this.resetForm();
          this.getAll();
        }
      }, 1000);
    })
  }
   async delete(usuario : IUsuario) 
  {
    if(await this.alertaService.questionDelete())
      {
        this.alertaService.ShowLoading();
        this.usuarioService.delete(usuario.idUsuario!).subscribe(((data: ServiceResponse)=>
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
    this.usuarioService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
      console.log(JSON.stringify(this.miFormulario.value))
      this.miFormulario.get('idUsuario')?.value === null ? this.insert() : this.update()
    }
  }

  getAll() {
    this.cargando = true;
    this.usuarioService.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      this.cargando=false;
      console.log(data.data)
    })
  }

  editar(usuario: IUsuario) {
    this.editando=true;
    this.miFormulario.patchValue(
      { 
         'idUsuario': usuario.idUsuario,
         'nombre': usuario.nombre ,
         'apellidos' : usuario.apellidos,
         'correo' : usuario.correo,
         'idRol' : usuario.rol.idRol,
        })
  }

  resetForm() {
    this.miFormulario.reset();
    this.editando=false;
  }
}
