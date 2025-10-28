import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { ValidatorFormService } from 'src/app/Core/utilities/validator-form.service';
import { iRol, ServiceResponse } from 'src/app/interfaces/service-response-login';
import { RolesService } from 'src/app/services/roles.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { iFuncionalidad, iModulo } from 'src/app/interfaces/iTermino';
import { ModulosServiceService } from 'src/app/services/modulos-service.service';
import { LoaderComponent } from 'src/app/components/loader/loader.component';




@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    importaciones,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    LoaderComponent
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent {

  displayedColumns: string[] = ['nombre', 'descripcion', 'acciones'];
  // dataSource = ELEMENT_DATA;

  constructor(
    private fb: FormBuilder,
    private validatorForm: ValidatorFormService,
    private alertaService: AlertServiceService,
    private rolService: RolesService,
    private moduloService: ModulosServiceService
  ) {
    this.getAll();
    this.getAllModulos();

  }
  miFormulario: FormGroup = this.fb.group(
    {
      idRol : this.fb.control(null),
      nombre: this.fb.control("", Validators.required),
      descripcion: this.fb.control("", Validators.required),
      modulos: this.fb.control(null, Validators.required),
    }
  )
  dataList: iRol[] = [];
  cargando: boolean = false;
  sinRegistros: boolean = false;
  editando: boolean = false;
  viewForm = false;
   
  
  showForm(){
   this.viewForm= this.viewForm==true? false : true;
    this.selectAll();
  }
  

  

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
  async delete(idRol: number) {
    if (await this.alertaService.questionDelete()) {
      this.alertaService.ShowLoading();
      this.rolService.delete(idRol).subscribe(((data: ServiceResponse) => {
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
    this.rolService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
      setTimeout(() => {
        this.alertaService.successAlert(data.message);
        data.status ? this.resetForm : '';
        this.getAll();
        this.resetForm();
      }, 1000);
    })
  }

  save() {
     this.setDetailPermisos();
     alert(this.miFormulario.valid)
    if (this.miFormulario.valid) {
      this.miFormulario.get('idRol')?.value === null ? this.insert() : this.update()
    }
  }

  getAll() {
    this.cargando=true;
    this.rolService.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      this.dataList.length > 0 ? this.sinRegistros = false : this.sinRegistros = true;
      this.cargando = false;
      this.cargando = false;
    })
  }

  editar(rol: iRol) {

    this.editando = true;
    this.viewForm=true;
    this.miFormulario.patchValue(
      { 'idRol': rol.idRol, 'nombre': rol.nombre, 'descripcion' : rol.descripcion, modulos : rol.modulos})
     this.dataListModulos = rol.modulos;
   
  }

  resetForm() {
    this.miFormulario.reset();
    this.editando = false;
    this.viewForm=false;
  }
  todo: boolean = true;
  dataListModulos: iModulo[] = [];
  dataListModulosSin: iModulo[] = [];
  getAllModulos() {
    this.moduloService.getAll().subscribe((result: ServiceResponse) => {
      if (result.status) {
       this.dataListModulos = result.data;
      }
    })
  }

  selectAll() {
    this.todo = !this.todo;
    this.dataListModulos.forEach(modulo => {
      modulo.funcionalidades?.forEach(func => {
        func.checked = this.todo;
         // ← usa el valor del checkbox principal
      });
    }); 
    console.log(this.dataListModulos)
  }
select(indexModulo: number, indexFuncionalidad: number, evento: any) {
  const funcionalidades = this.dataListModulos[indexModulo].funcionalidades;
  if (funcionalidades && funcionalidades[indexFuncionalidad]) {
     let funcionalidadModificada = funcionalidades[indexFuncionalidad];
     funcionalidadModificada.checked=evento.checked;
    //  funcionalidadModificada.checked = evento.target.checked;
     this.dataListModulos[indexModulo].funcionalidades[indexFuncionalidad]=funcionalidadModificada;
  
  }

}



  setDetailPermisos() {
    this.miFormulario.patchValue({modulos : this.dataListModulos});
  }
}