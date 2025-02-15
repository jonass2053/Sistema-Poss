import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { iCategoria, iMarcaget } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MarcasService } from 'src/app/services/marcas.service';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss'
})
export class BrandComponent {

  constructor(
    private fb: FormBuilder,
    private alertaService: AlertServiceService,
    private marcaSwervice: MarcasService,
    private categoriaService: CategoriaService
  ) {
    this.getAll();
    this.getAllCategorias();
  }
  miFormulario: FormGroup = this.fb.group(
    {
      idMarca: this.fb.control(null),
      idCategoria: this.fb.control(null, Validators.required),
      nombre: this.fb.control("", Validators.required),
    }
  )
  dataList: iMarcaget[] = [];
  dataListCategorias: iCategoria[] = [];
  cargando: boolean = false;
  sinRegistros: boolean = false;
  editando: boolean = false;
  displayedColumns: string[] = ['idMarca',  'nombre', 'acciones'];




  insert() {
    this.alertaService.ShowLoading();
    this.marcaSwervice.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
      this.marcaSwervice.delete(idRol).subscribe(((data: ServiceResponse) => {
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
    this.marcaSwervice.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
      setTimeout(() => {
        this.alertaService.successAlert(data.message);
        this.resetForm();
        this.getAll();
      }, 1000);
    })
  }

  save() {
    if (this.miFormulario.valid) {
      console.log(this.miFormulario.value)
      this.miFormulario.get('idMarca')?.value === null ? this.insert() : this.update()
    }
  }

  getAll() {
    this.cargando = true;
    this.marcaSwervice.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      console.log(data.data)
      this.dataList.length > 0 ? this.sinRegistros = false : this.sinRegistros = true;
      this.cargando = false;
    })
  }

  editar(marca: any) {
    this.editando=true;
    this.miFormulario.patchValue(
      { 'idMarca': marca.idMarca, 'idCategoria': marca.categoria.idCategoria, 'nombre': marca.nombre, });
    console.log(this.miFormulario.value)
  }

  resetForm() {
    this.miFormulario.reset();
    this.editando = false;
  }

  getAllCategorias() {
    this.categoriaService.getAll().subscribe((data: ServiceResponse) => {
      this.dataListCategorias = data.data;
    })
  }
  getAllFilter(event: any) {
    const filtro = (event.target as HTMLInputElement).value;
    if (filtro == "") {
      this.getAll();
    }
    else {
      this.cargando = true;
      this.marcaSwervice.getAllFilter(filtro).subscribe((data: any) => {
        this.dataList = data.data;
        if (this.dataList.length > 0) {
          this.sinRegistros = false
          this.cargando = false;
        }
        else {
          this.sinRegistros = true;
          this.cargando = false;
        }
      })
    }

  }
}
