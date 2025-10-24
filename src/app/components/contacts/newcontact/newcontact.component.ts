import { Component, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { MsjService } from 'src/app/Core/utilities/msj.service';
import { iContactoPos, idNumeracion, idTipoContacto, iTermino, iVendedor } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { ContactosService } from 'src/app/services/contactos.service';
import { InformationService } from 'src/app/services/information.service';
import { NumeracionService } from 'src/app/services/numeracion.service';
import { TerminosService } from 'src/app/services/terminos.service';
import { VendedoresService } from 'src/app/services/vendedores.service';

@Component({
  selector: 'app-newcontact',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './newcontact.component.html',
  styleUrl: './newcontact.component.scss'
})
export class NewcontactComponent {
  constructor(
    private fb: FormBuilder,
    private alertaService: AlertServiceService,
    private msjService: MsjService,
    private contactoService: ContactosService,
    private numeracionService: NumeracionService,
    private terminoService: TerminosService,
    private vendedorService: VendedoresService,
    private informationService: InformationService,
    private route: ActivatedRoute,
    private router: Router,
    @Optional() public dialogRef: MatDialogRef<NewcontactComponent>
  ) {

    this.getAll();
    this.getAllTipoContacto();
    this.getAllTipoNumeracion();
    this.getAllTerminos();
    this.getAllVendedores();
    this.idContacto = this.route.snapshot.paramMap.get('id');
    this.tipoContacto = this.route.snapshot.paramMap.get('tipo');
    

    if (this.idContacto !== 0 || this.idContacto !== '0') {
      this.getContactById(this.idContacto);
    }



  }

  miFormulario: FormGroup = this.fb.group(
    {
      idContacto: this.fb.control(null),
      idTipoContacto: this.fb.control("", Validators.required),
      tipoIdentificacion: this.fb.control("", Validators.required),
      rnc: this.fb.control("", Validators.required),
      nombreRazonSocial: this.fb.control("", Validators.required),
      direccion: this.fb.control(""),
      correo: this.fb.control("", Validators.email),
      celular: this.fb.control("", Validators.required),
      telefono1: this.fb.control(""),
      telefono2: this.fb.control(""),
      idNumeracion: this.fb.control(null, Validators.required),
      limiteCredito: this.fb.control(0),
      idVendedor: this.fb.control(null),
      idTermino: this.fb.control("", Validators.required),
      incluirEstadoCuenta: this.fb.control(false),
      predeterminado: this.fb.control(false),
      idEmpresa: this.fb.control(false),
    });


  tipoIdentificacion = [
    { nombre: "RNC" },
    { nombre: "Cedula" },
    { nombre: "Pasaporte" },
  ]
  dataListVendedor: iVendedor[] = [];
  dataListTerminos: iTermino[] = [];
  dataListTipoNumeracion: idNumeracion[] = [];
  dataList: iContactoPos[] = [];
  dataListFilter: iContactoPos[] = [];
  dataListTipoContacto: idTipoContacto[] = [];
  cargando: boolean = false;
  sinRegistros: boolean = false;
  sinRegistrosTxt: string = this.msjService.msjSinRegistros;
  checked = false;
  color: ThemePalette = 'primary';
  disabled = false;
  documentoSeleccionado: any = "";
  idContacto: any = 0;
  tipoContacto: any = 1;


  insert() {
    this.alertaService.ShowLoading();
    console.log(this.miFormulario.value)
    this.contactoService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
      setTimeout(() => {
        this.alertaService.successAlert(data.message);
        if (data.status) {
          this.resetForm();
          this.getAll();
        }
      }, 1000);
    })
  }
  async delete(id: any) {
    if (await this.alertaService.questionDelete()) {
      this.alertaService.ShowLoading();
      this.contactoService.delete(id).subscribe(((data: ServiceResponse) => {
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
    this.contactoService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
      setTimeout(() => {
        this.alertaService.successAlert(data.message);
        data.status ? this.resetForm : '';
        this.getAll();
      }, 1000);
    })
  }

  save() {
    this.setNumeracion();
    if (this.miFormulario.valid) {
      this.miFormulario.get('idContacto')?.value === null ? this.insert() : this.update()
    }
  }

  getAll() {
    this.cargando = true;
    this.contactoService.getAll(this.informationService.idEmpresa).subscribe((data: any) => {
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

  getAllFilter(event: any) {
    const filtro = (event.target as HTMLInputElement).value;
    if (filtro == "") {
      this.getAll();
    }
    else {
      this.cargando = true;
      this.contactoService.getAllFilter(filtro, this.informationService.idEmpresa).subscribe((data: any) => {
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

  getAllFilterByTipo(idTipo: number) {
    this.cargando = true;
    this.contactoService.getByIdTipo(idTipo).subscribe((data: any) => {
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


  getAllTipoContacto() {
    this.contactoService.getAllTipoContacto().subscribe((response: ServiceResponse) => {
      if (response.status) {
        this.dataListTipoContacto = response.data;
      }
    })
  }

  getAllTipoNumeracion() {
    this.numeracionService.getAll(this.informationService.idEmpresa).subscribe((response: ServiceResponse) => {
      if (response.status) {
        this.dataListTipoNumeracion = response.data;
        this.setNumeracion();

      }
    })
  }


  getAllTerminos() {
    this.terminoService.getAll().subscribe((response: ServiceResponse) => {
      if (response.status) {
        this.dataListTerminos = response.data;
      }
    })
  }


  getAllVendedores() {
    this.vendedorService.getAll().subscribe((response: ServiceResponse) => {
      if (response.status) {
        this.dataListVendedor = response.data;
      }
    })
  }

  getContactById(id: number) {
    this.contactoService.getById(id).subscribe((data: ServiceResponse) => {
      if (data.data) {
        this.miFormulario.reset(data.data);
      }
    })
  }

  resetForm() {
    this.miFormulario.reset();
    if (this.dialogRef != null) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['/inventary'])
    }


  }

  filterContact(value: number) {
    value == 0 ? this.getAll() : this.getAllFilterByTipo(value);
  }

  setNumeracion() {
    if (this.tipoContacto == 2) {

      this.miFormulario.patchValue({ idNumeracion: this.dataListTipoNumeracion.find(c => c.nombre.includes("Compra"))?.idNumeracion });
    }else{
      this.dataListTipoNumeracion = this.dataListTipoNumeracion.filter(c=>c.nombre.includes("Factu"))
    }

  }

}
