import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { iCategoria } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { CategoriaService } from 'src/app/services/categoria.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  constructor(
    private fb: FormBuilder,
    private alertaService: AlertServiceService,
    private categoriaService: CategoriaService
  ) {
    this.getAll();
  }
  miFormulario: FormGroup = this.fb.group(
    {
      idCategoria: this.fb.control(null),
      nombre: this.fb.control("", Validators.required),
    }
  )
  dataList: iCategoria[] = [];
  cargando : boolean = false;
  sinRegistros : boolean = false;
  displayedColumns: string[] = ['idCategoria', 'nombre', 'acciones'];
  editando : boolean = false;



  insert() {
    this.alertaService.ShowLoading();
    this.categoriaService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
      setTimeout(() => {
        this.alertaService.successAlert(data.message);
        if (data.status) {
          this.getAll();
          this.resetForm();

        }
      }, 1000);
    })  
  }
   async delete(idCategoria : any) 
  {
    if(await this.alertaService.questionDelete())
      {
        this.alertaService.ShowLoading();
        this.categoriaService.delete(idCategoria).subscribe(((data: ServiceResponse)=>
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
    this.categoriaService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
      setTimeout(() => {
        this.alertaService.successAlert(data.message);
        this.getAll();
        this.resetForm();
      }, 1000);
    })
  }

  save() {
    if (this.miFormulario.valid) {
      this.miFormulario.get('idCategoria')?.value === null ? this.insert() : this.update()
      this.editando=false;
    }
  }

  getAll() {
    this.cargando=true;
    this.categoriaService.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      this.dataList.length>0 ? this.sinRegistros=false : this.sinRegistros=true;
      this.cargando=false;
    })
  }

  editar(categoria: iCategoria) {
    this.editando=true;
    this.miFormulario.patchValue(
      { 'idCategoria': categoria.idCategoria, 'nombre': categoria.nombre })
  }

  resetForm() {
    this.miFormulario.reset();
    this.editando=false;
  }
}
