import { Component, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { timeout } from 'rxjs';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { MsjService } from 'src/app/Core/utilities/msj.service';
import { ProductComponent } from 'src/app/dashboard/dashboard-components/product/product.component';
import { iAlmacen, iCategoria, iCuentas, iiMpuesto, iImpuestoProductoCodigo, iMarca, iModelo, iMoneda, iProducto, iUnidades } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { AlmacenService } from 'src/app/services/almacen.service';
import { ImpuestosService } from 'src/app/services/impuestos.service';
import { InformationService } from 'src/app/services/information.service';
import { MarcasService } from 'src/app/services/marcas.service';
import { ModelosService } from 'src/app/services/modelos.service';
import { ProductoService } from 'src/app/services/producto.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  miFormulario: FormGroup = this.fb.group(
    {
      idProducto: this.fb.control(0),
      isProduct: this.fb.control(false, Validators.required),
      idMarca: this.fb.control(''),
      idModelo: this.fb.control(''),
      nombre: this.fb.control("", Validators.required),
      idUnidad: this.fb.control(''),
      costoInicial: this.fb.control(0, Validators.required),
      precioBase: this.fb.control(0, Validators.required),
      precioFinal: this.fb.control(0),
      descripcion: this.fb.control(''),
      idAlmacen: this.fb.control(''),
      cantInicial: this.fb.control(0),
      cantMinima: this.fb.control(0),
      cantMaxima: this.fb.control(0),
      imagen: this.fb.control(''),
      venderSinUnidades: this.fb.control(false),
      idCategoria: this.fb.control(''),
      idEmpresa: this.fb.control(null),
      filterUnidades: this.fb.control(''),
      idImpuesto: this.fb.control(null),
      barCode: this.fb.control('')
    });


  constructor(
    private fb: FormBuilder,
    private alertaService: AlertServiceService,
    private msjService: MsjService,
    private productoService: ProductoService,
    private impuestoService: ImpuestosService,
    private almacenService: AlmacenService,
    private usuarioService: UsuarioService,
    private marcaService: MarcasService,
    private modeloService: ModelosService,
    private informationService: InformationService,
    private route: ActivatedRoute,
    private router: Router,
    @Optional() public dialogRef: MatDialogRef<ProductComponent>

  ) {
    // this.getAllUnidadesFilter('a');
    this.getAllImpuesto();
    this.getAllAlmacenes();
    this.getAllCategorias();
    this.moneda = this.usuarioService.usuarioLogueado.data.sucursal.empresa.moneda;
    this.miFormulario.patchValue({ idSucursal: this.informationService.idSucursal })
    this.idProducto = this.route.snapshot.paramMap.get('id');
    if (this.idProducto !== '0' && this.idProducto != null) {
      this.getById(this.idProducto);
    }
  }
  impuestosArrayNumber: number[] = [];
  tipoIdentificacion = [
    { nombre: "RNC" },
    { nombre: "Cedula" },
    { nombre: "Pasaporte" },
  ]
  impuestosCodigos: iImpuestoProductoCodigo[] = [];
  impuestosData: iiMpuesto[] = [];
  dataList: iProducto[] = [];
  dataListAlmacenes: iAlmacen[] = [];
  dataListUnidades: iUnidades[] = [];
  dataListCategoria: iCategoria[] = [];
  dataListCuentas: iCuentas[] = [];
  dataListImpuesto: iiMpuesto[] = [];
  dataListMarcas: iMarca[] = [];
  dataListModelos: iModelo[] = [];
  cargando: boolean = false;
  sinRegistros: boolean = false;
  sinRegistrosTxt: string = this.msjService.msjSinRegistros;
  checked = false;
  color: ThemePalette = 'primary';
  disabled = false;
  documentoSeleccionado: any = "";
  selectedFile: File | undefined;
  imageUrl: string | ArrayBuffer | null = null;
  formData = new FormData();
  isProduct: boolean = false;
  impuestoArray: Array<iiMpuesto> = [];
  moneda!: iMoneda;
  productoForEdit!: iProducto;
  idProducto?: any = '0';


  uploadFile(file: File) {
    this.formData.append('file', file);
  }


  insert() {
    this.alertaService.ShowLoading();
    this.productoService.insert(this.formData).subscribe((data: ServiceResponse) => {
      this.impuestosArrayNumber.forEach((a: number) => {
        let imp = new iImpuestoProductoCodigo();
        imp.idProducto = data.data.idProducto;
        imp.idImpuesto = a;
        this.impuestosCodigos.push(imp);
      });
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
      this.productoService.delete(id).subscribe(((data: ServiceResponse) => {
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

  editar(producto: iProducto) {
    this.miFormulario.reset(producto)
    this.isProduct = producto.isProduct;
    this.getMarcas(this.miFormulario.value.idCategoria)
    this.getModelos(this.miFormulario.value.idMarca)
    this.miFormulario.patchValue({ 'idUnidad': producto.idUnidad })
    this.imageUrl = producto.imagen;
    this.miFormulario.patchValue({ impuestos: producto.impuestos[0] })
    this.productoService.getAllUnidadesFilter(producto.idUnidad.toString()).subscribe((data: any) => {
      this.miFormulario.patchValue({ 'filterUnidades': data.data.find((c: any) => c.idUnidad == producto.idUnidad) })
    })
  }


  update() {
    this.alertaService.ShowLoading();
    this.productoService.update(this.formData).subscribe((data: ServiceResponse) => {
      setTimeout(() => {
        this.alertaService.successAlert(data.message);
        data.status ? this.resetForm : '';
        this.resetForm();
      }, 1000);
    })
  }


  save() {
    this.formData.append('idSucursal', this.informationService.idSucursal.toString())
    this.formData.append('idEmpresa', this.usuarioService.usuarioLogueado.data.sucursal.idEmpresa)
    this.formData.append('nombre', this.miFormulario.get('nombre')?.value);
    this.formData.append('idProducto', this.miFormulario.get('idProducto')?.value)
    this.formData.append('isProduct', this.miFormulario.get('isProduct')?.value);
    this.formData.append('idUnidad', this.miFormulario.get('idUnidad')?.value == null ? '' : this.miFormulario.get('idUnidad')?.value);
    this.formData.append('costoInicial', this.miFormulario.get('costoInicial')?.value);
    this.formData.append('precioBase', this.miFormulario.get('precioBase')?.value);
    this.formData.append('precioFinal', this.miFormulario.get('precioFinal')?.value);
    this.formData.append('descripcion', this.miFormulario.get('descripcion')?.value);
    this.formData.append('idAlmacen', this.miFormulario.get('idAlmacen')?.value == null ? '' : this.miFormulario.value.idAlmacen);
    this.formData.append('idImpuesto', this.miFormulario.value.idImpuesto);
    this.formData.append('cantInicial', this.miFormulario.get('cantInicial')?.value);
    this.formData.append('cantMinima', this.miFormulario.get('cantMinima')?.value);
    this.formData.append('cantMaxima', this.miFormulario.get('cantMaxima')?.value);
    this.formData.append('venderSinUnidades', this.miFormulario.get('venderSinUnidades')?.value == null ? '' : this.miFormulario.value.venderSinUnidades);
    this.formData.append('idCategoria', this.miFormulario.get('idCategoria')?.value == null ? '' : this.miFormulario.value.idCategoria);
    this.formData.append('idMarca', this.miFormulario.get('idMarca')?.value == null ? '' : this.miFormulario.value.idMarca);
    this.formData.append('idModelo', this.miFormulario.get('idModelo')?.value == null ? '' : this.miFormulario.value.idModelo);
    this.formData.append('idImpuesto', this.miFormulario.get('idImpuesto')?.value == null ? '' : this.miFormulario.value.idImpuesto);
    this.formData.append('barCode', this.miFormulario.get('barCode')?.value == null ? '' : this.miFormulario.value.barCode);
    if (this.miFormulario.valid) {
      this.miFormulario.get('idProducto')?.value === 0 ? this.insert() : this.update();
    }
    else {
      this.alertaService.warnigAlert("Debe completar los campos necesarios para poder guardar el articulo.");
    }
  }


  getAll() {
    this.cargando = true;
    this.productoService.getAll(this.informationService.idSucursal).subscribe((data: any) => {
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

  getAllCuentas() {
    this.productoService.getAllCuentas().subscribe((data: any) => {
      this.dataListUnidades = data.data;
    })
  }


  getAllCategorias() {
    this.productoService.getAllCategorias().subscribe((data: ServiceResponse) => {
      this.dataListCategoria = data.data;
    })
  }


  displayFn(producto?: iProducto): string | undefined | any {
    return producto ? producto.nombre : undefined;
  }

  getById(idProducto: number | any) {
    this.alertaService.ShowLoading();
    this.productoService.getById(idProducto).subscribe((data: ServiceResponse) => {
      if (data.status) {
        this.productoForEdit = data.data;
        this.miFormulario.reset(this.productoForEdit);
        this.imageUrl = data.data.imagen;
        this.alertaService.hideLoading();
        this.isProduct = data.data.isProduct;
      }
    })
  }

  displayFnImpuesto(impuesto?: iiMpuesto): string | undefined | any {
    return impuesto ? impuesto.nombre : undefined;
  }
  getAllFilter(event: any) {
    const filtro = (event.target as HTMLInputElement).value;
    if (filtro == "") {
      this.getAll();
    }
    else {
      this.cargando = true;
      this.productoService.getAllFilter(filtro, this.informationService.idSucursal).subscribe((data: any) => {
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

  // getAllFilterByTipo(idTipo : number) {
  //   this.cargando = true;
  //   this.productoService.getByIdTipo(idTipo).subscribe((data: any) => {
  //     this.dataList = data.data;
  //     if (this.dataList.length > 0) {
  //       this.sinRegistros = false
  //       this.cargando = false;
  //     }
  //     else {
  //       this.sinRegistros = true;
  //       this.cargando = false;
  //     }
  //   })
  // }




  resetForm() {
    this.miFormulario.reset();
    this.miFormulario.patchValue({
      isProduct: this.isProduct,
      cantInicial: 0,
      cantMinima: 0,
      cantMaxima: 0
    })
    this.isProductView(0);
    this.imageUrl = '';
    if (this.idProducto !== 0 || this.idProducto !== '0') {
      if (this.dialogRef != null) {
        this.dialogRef.close();
      } else {
        this.router.navigate(['/inventary'])

      }

    }

  }


  onFileSelected(event: any) {
    this.formData.append('imagen', (event.target.files[0] as File))
    this.selectedFile = event.target.files[0] as File;
    this.previewImage();
  }
  previewImage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
    }
  }
  getAllImpuesto() {
    this.impuestoService.getAll().subscribe((data: ServiceResponse) => {
      this.dataListImpuesto = data.data;
      if (this.miFormulario.value.idProducto === 0) {
        this.miFormulario.patchValue({ idImpuesto: data.data.find((c: iiMpuesto) => c.idImpuesto == 3).idImpuesto })
      }

    })
  }



  setUnidad(event: any) {
    this.miFormulario.patchValue({ "idUnidad": event.option.value.idUnidad })
  }

  //Set precio total controla el impuesto
  contadorExecnto: number = 0;
  setPrecioTotal(accion: number, impuesto?: iiMpuesto) {
    if (impuesto === undefined) {
      this.miFormulario.patchValue({ 'precioFinal': this.miFormulario.value.precioBase })
    }
    else {
      let montoCalculado = this.miFormulario.value.precioBase + ((impuesto.porcentaje / 100) * this.miFormulario.value.precioBase);
      this.miFormulario.patchValue({ 'precioFinal': montoCalculado })
    }
  }


  getAllAlmacenes() {
    this.almacenService.getAll().subscribe((data: ServiceResponse) => {
      this.dataListAlmacenes = data.data;
      if (data.data[0] !== undefined) {
        this.miFormulario.patchValue({ idAlmacen: data.data[0].idAlmacen });
      }
    })
  }

  isProductView(value: number) {
    value == 1 ? this.isProduct = true : this.isProduct = false;
    value == 0 ? this.miFormulario.patchValue({ 'idCategoria': null, 'idMarca': null, 'idModelo': null }) : '';
  }

  getMarcas(idCategoria: number) {
    this.marcaService.getByIdCategoria(idCategoria).subscribe((data: ServiceResponse) => {
      this.dataListMarcas = data.data;
    })
  }

  getModelos(idMarca: number) {
    this.modeloService.getByIdMarca(idMarca).subscribe((data: ServiceResponse) => {
      this.dataListModelos = data.data;
    })
  }


}
