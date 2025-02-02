import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter, ThemePalette } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { MsjService } from 'src/app/Core/utilities/msj.service';
import { ValidatorFormService } from 'src/app/Core/utilities/validator-form.service';
import { idNumeracion, iTipoDocumento, iTipoNumeracion } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { NumeracionService } from 'src/app/services/numeracion.service';

@Component({
  selector: 'app-numbers',
  standalone: true,
  imports: [
    importaciones,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [provideNativeDateAdapter()],

  templateUrl: './numbers.component.html',
  styleUrl: './numbers.component.scss'
})
export class NumbersComponent {
  constructor(
    private fb: FormBuilder,
    private validatorForm: ValidatorFormService,
    private numeracionService: NumeracionService,
    private alertaService: AlertServiceService,
    private msjService: MsjService
  ) {

    this.getAll();
    this.getAllTpoDocumentos()
  }
  miFormulario: FormGroup = this.fb.group(
    {
      idNumeracion: this.fb.control(null),
      idTipoDocumento: this.fb.control("", Validators.required),
      idTipoNumeracion: this.fb.control(""),
      nombre: this.fb.control("", Validators.required),
      predeterminada: this.fb.control(false),
      vigencia: this.fb.control(""),
      prefijo: this.fb.control(""),
      numeracionInicial: this.fb.control("", Validators.required),
      contador: this.fb.control("", Validators.required),
      numeracionFinal: this.fb.control(""),
    });

  dataList: idNumeracion[] = [];
  dataListTipoDocumentos: iTipoDocumento[] = [];
  dataListTipoNumeracion: iTipoNumeracion[] = [];
  cargando: boolean = false;
  sinRegistros: boolean = false;
  sinRegistrosTxt: string = this.msjService.msjSinRegistros;
  color: ThemePalette = 'primary';
  checked = false;
  disabled = false;
  documentoSeleccionado :  any ="";
  displayedColumns: string[] = ['idNumeracion', 'nombre', 'prefijo', 'numeracionInicial', 'contador', 'predeterminada', 'acciones'];





  insert() {
    this.alertaService.ShowLoading();
    this.numeracionService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
      this.numeracionService.delete(id).subscribe(((data: ServiceResponse) => {
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
    this.numeracionService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
      setTimeout(() => {
        this.alertaService.successAlert(data.message);
        data.status ? this.resetForm : '';
        this.getAll();
      }, 1000);
    })
  }

  updateStatus(id: number, estado : boolean) {
    this.numeracionService.updateStatus(id, estado).subscribe((data: ServiceResponse) => {
      setTimeout(() => {
        // this.alertaService.successAlert(data.message);
        data.status ? this.resetForm : '';
        this.getAll();
      }, 1000);
    })
  }

  setNumberDefault(id: number) {
    // this.alertaService.ShowLoading();
    this.numeracionService.setDefautlNumeration(id).subscribe((data: ServiceResponse) => {
      setTimeout(() => {
        // this.alertaService.successAlert(data.message);
        data.status ? this.resetForm : '';
        this.getAll();
        // this.closeModal();
      }, 1000);
    })
  }

  save() {
    if (this.miFormulario.valid) {
      this.miFormulario.get('idNumeracion')?.value === null ? this.insert() : this.update()
    }
  }

  getAll() {
    this.cargando = true;
    this.numeracionService.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      if(this.dataList.length > 0){
          this.sinRegistros = false
          this.cargando = false;
        }
        else{
          this.sinRegistros = true;
          this.cargando = false;
        }
    })
  }

  getAllTpoDocumentos() {
    this.numeracionService.getAllTipoDocumentos().subscribe((data: any) => {
      this.dataListTipoDocumentos = data.data;
    })
  }

  getTipoNumeracion(id: number) {
    this.numeracionService.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      console.log(data.data)
    })
  }


  editar(numeracion: idNumeracion) {
    this.cargarTipoNumeracion(numeracion.idTipoDocumento)
    this.miFormulario.patchValue({
        'idNumeracion' : numeracion.idNumeracion,
        'idTipoDocumento': numeracion.idTipoDocumento,
        'idTipoNumeracion': numeracion.idTipoNumeracion,
        'nombre': numeracion.nombre,
        'predeterminada': numeracion.predeterminada,
        'vigencia': numeracion.vigencia,
        'prefijo': numeracion.prefijo,
        'numeracionInicial': numeracion.numeracionInicial,
        'contador': numeracion.contador,
        'numeracionFinal': numeracion.numeracionFinal
      })
      console.log(numeracion.idTipoDocumento)
  }

  resetForm() {
    this.miFormulario.reset();
    this.dataListTipoNumeracion =[];
  }

  cargarTipoNumeracion(idTipoDocumento: any){
    this.documentoSeleccionado = this.dataListTipoDocumentos.filter((c:any)=>c.idTipoDocumento===idTipoDocumento)[0].nombre;
      this.numeracionService.getTipoNumeracion(idTipoDocumento).subscribe((response: ServiceResponse)=>{
          this.dataListTipoNumeracion = response.data;
        }
      )}
  
  seleccionarTipoNumeracion(tipo : any){
    if(this.documentoSeleccionado.includes("Factura")){
        this.miFormulario.patchValue({"prefijo": tipo.prefijo, "nombre": `Factura  ${tipo.nombre}`})
      }else{
        this.miFormulario.patchValue({"prefijo": tipo.prefijo, "nombre": tipo.nombre},)
      } 
  }
}
