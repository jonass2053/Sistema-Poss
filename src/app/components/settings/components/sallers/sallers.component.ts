import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { MsjService } from 'src/app/Core/utilities/msj.service';
import { ValidatorFormService } from 'src/app/Core/utilities/validator-form.service';
import { iVendedor } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { VendedoresService } from 'src/app/services/vendedores.service';

@Component({
  selector: 'app-sallers',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './sallers.component.html',
  styleUrl: './sallers.component.scss'
})
export class SallersComponent {
  displayedColumns: string[] = ['idVendedor', 'nombre', 'Cedula/Rnc', 'observaciones', 'acciones'];

  constructor(
    private fb: FormBuilder,
    private validatorForm: ValidatorFormService,
    private vendedoresService: VendedoresService,
    private alertaService: AlertServiceService,
    private msjService: MsjService
  ) {

    this.getAll();
  }
  miFormulario: FormGroup = this.fb.group(
    {
      idVendedor: this.fb.control(null),
      nombre: this.fb.control("", Validators.required),
      rnc: this.fb.control(""),
      observaciones: this.fb.control(""),
     

    });
  dataList: iVendedor[] = [];
  cargando: boolean = false;
  sinRegistros: boolean = false;
  sinRegistrosTxt: string = this.msjService.msjSinRegistros;
  color: ThemePalette = 'primary';
  checked = false;
  disabled = false;
  documentoSeleccionado :  any ="";
  editando : boolean = false;



  insert() {
    this.alertaService.ShowLoading();
    this.vendedoresService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
      setTimeout(() => {
        this.alertaService.successAlert(data.message);
        if (data.status) {
          this.resetForm();
          this.getAll();
        }
      }, 1000);
    })
  }
  async delete(id: number) {
    if (await this.alertaService.questionDelete()) {
      this.alertaService.ShowLoading();
      this.vendedoresService.delete(id).subscribe(((data: ServiceResponse) => {
        if (data.status) {
          this.alertaService.successAlert(data.message);
          this.getAll();
          this.resetForm();
        }
        else {
          this.alertaService.errorAlert(data.message)
        }
      }))
    }
  }


  update() {
    this.alertaService.ShowLoading();
    this.vendedoresService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
      this.miFormulario.get('idVendedor')?.value === null ? this.insert() : this.update()
    }
  }

  getAll() {
    this.cargando = true;
    this.vendedoresService.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      console.log(data.data)
      if(this.dataList.length > 0){
          this.sinRegistros = false
          this.cargando = false;
        } else{
          this.sinRegistros = true;
          this.cargando = false;
        }
    })
  }


  editar(vendedor: iVendedor) {
    this.editando=true;
    this.miFormulario.patchValue(
      {
        'idVendedor' : vendedor.idVendedor,
        'nombre': vendedor.nombre,
        'rnc': vendedor.rnc,
        'observaciones': vendedor.observaciones
      
      })
  }

  resetForm() {
    this.miFormulario.reset();
    this.editando=false;
  }
}
