import { DatePipe } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS, provideNativeDateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones, MY_DATE_FORMATS } from 'src/app/Core/utilities/material/material';
import { iBanco, iContactoPos, iDetalleFactura, idNumeracion, iFactura, iiMpuesto, iMoneda, iProducto, iTermino, iTipoDocumento, iVendedor } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { BancosService } from 'src/app/services/bancos.service';
import { ContactosService } from 'src/app/services/contactos.service';
import { FacturaService } from 'src/app/services/factura.service';
import { InformationService } from 'src/app/services/information.service';
import { NumeracionService } from 'src/app/services/numeracion.service';
import { ProductoService } from 'src/app/services/producto.service';
import { TerminosService } from 'src/app/services/terminos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VendedoresService } from 'src/app/services/vendedores.service';
import { addDays, sub } from 'date-fns';
import { MatTableDataSource } from '@angular/material/table';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { MatDialog } from '@angular/material/dialog';
import { PaymenSalesComponent } from '../paymen-sales/paymen-sales.component';
import { LoaderComponent } from '../../loader/loader.component';
import { NodataComponent } from '../../nodata/nodata.component';

declare var $: any;

@Component({
  selector: 'app-newsales',
  standalone: true,
  imports: [
    importaciones,
    CdkStepperModule,
    LoaderComponent,
    NodataComponent
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    provideNativeDateAdapter(), DatePipe,

  ],
  templateUrl: './newsales.component.html',
  styleUrl: './newsales.component.scss'
})
export class NewsalesComponent implements OnDestroy {
  @ViewChild('exampleModal') myModal!: ElementRef;

  readonly dialog = inject(MatDialog);

  isEditable = false;
  metodoPagoSeleccionado = "";
  moneda!: iMoneda;
  prodcutoSeleccionado!: iProducto;
  impuestoProduct: number = 0;
  btnPagar: number = 0;
  document: string = "";
  idNumeracion: number = 0;
  displayedColumns: string[] = ['item', 'descripcion', 'cantidad', 'precio', 'subtotal', 'descuento', 'itbis', 'total', 'acciones'];
  activePayment: boolean = false;
  idFactura: any = 0;
  idTipoDocumento : any =0;
  desc: boolean = false;
  loader: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private alertaService: AlertServiceService,
    private contactoService: ContactosService,
    private plazoService: TerminosService,
    private fb: FormBuilder,
    private numeracionService: NumeracionService,
    private datePipe: DatePipe,
    private vendedoresService: VendedoresService,
    private productoService: ProductoService,
    public facturaServcie: FacturaService,
    private bancoService: BancosService,
    private router: Router,
    private route: ActivatedRoute,
    public informationService: InformationService
  ) {
    this.document = informationService.tipoDocumento;
    if (this.usuarioService.usuarioLogueado != undefined) {
      this.moneda = this.usuarioService.usuarioLogueado.data.sucursal.empresa.moneda;
    }
    this.miFormulario.patchValue({ fecha: new Date(), cantidad: 1 })
    this.getAllTerminos();
    this.getAllNumeracion();
    this.getAllVendedores();
    this.getTipoDocumentos();
    this.getAllBancos();
    this.getAllProduct();
    this.getAllContactos();
    this.idFactura = this.route.snapshot.paramMap.get('id');
    this.idTipoDocumento = this.route.snapshot.paramMap.get('idtipo');
    this.document =  informationService.tipoDocumento;
    if (this.idFactura !== '0' && this.idFactura !== 0) {
      this.getById(this.idFactura);
    }
    
  }
  ngOnDestroy(): void {
    localStorage.setItem('isPos', 'false');
  }


  editarFactura(factura: iFactura) {
    this.miFormulario.patchValue({
      idFactura: factura.idFactura,
      idNumeracion: factura.idNumeracion,
      idContacto: factura.idContacto,
      identificacion: factura.contacto.rnc,
      telefono: factura.contacto.telefono1,
      idTipoDocumento: this.idTipoDocumento,
      idSucursal: factura.idSucursal,
      idEmpresa: factura.idEmpresa,
      idTermino: factura.idTermino,
      idUsuario: factura.idUsuario,
      idVendedor: factura.idVendedor,
      vencimiento: factura.vencimiento,
      detalle: factura.detalle,
      subTotal: factura.subTotal,
      totalGeneral: factura.totalGeneral,
      nombreClienteCompleto: factura.contacto.nombreRazonSocial,
      montoPagado: factura.montoPagado,
      idDocumento: this.idTipoDocumento==1 && this.document=="Cotización"? factura.idFactura : undefined

    })
    this.idNumeracion = this.idTipoDocumento==1 && this.document=="Cotización"? factura.contacto.idTipoNumeracion :factura.idNumeracion,
    this.impuestosGenerales = factura.itbis;
    this.miFormulario.get('nombreClienteCompleto')?.setValue(factura.contacto); // Cambia "Opción 2" por el valor deseado
    this.dataListDetalleFactura = factura.detalle;
    this.dataSource.data = factura.detalle;
    // this.dataListDetalleFactura.forEach(c=>{
    //   c.impuestosObject?.forEach (element => {
    //     this.dataListImpuestosDetails.push(element)
    //   });
    // })
    this.totalGeneral = factura.totalGeneral;
    this.subTotalGeneral = factura.subTotal;
    this.descuentoGeneral = factura.descuento;
    this.totalApagar = factura.montoPorPagar


  }


  miFormulario: FormGroup = this.fb.group({
    idFactura: this.fb.control(null),
    idNumeracion: this.fb.control('', Validators.required),
    idContacto: this.fb.control("", Validators.required),
    idTipoDocumento: this.fb.control("", Validators.required),
    idSucursal: this.fb.control("", Validators.required),
    idEmpresa: this.fb.control("", Validators.required),
    idTermino: this.fb.control("", Validators.required),
    idUsuario: this.fb.control("", Validators.required),
    idVendedor: this.fb.control(null),
    identificacion: this.fb.control({ value: "", disabled: true }),
    vencimiento: this.fb.control(""),
    telefono: this.fb.control({ value: "", disabled: true }),
    fecha: this.fb.control(""),
    descripcion: this.fb.control({ value: "", disabled: true }),
    precio: this.fb.control({ value: 0, disabled: false }),
    cantidad: this.fb.control(0),
    descuento: this.fb.control({ value: 0, disabled: false }),
    impuesto: this.fb.control(0),
    impuestos: this.fb.control(0),
    idBanco: this.fb.control(null),
    producto: this.fb.control(''),
    impuestoObjet: this.fb.control(""),
    subTotalDetails: this.fb.control(0),
    total: this.fb.control(0),
    subTotal: this.fb.control(0),
    totalGeneral: this.fb.control(0),
    itbis: this.fb.control(0),
    detalle: this.fb.control(""),
    comentario: this.fb.control(""),
    nombreClienteCompleto: this.fb.control("", Validators.required),
    efectivo: this.fb.control(0),
    montoPagado: this.fb.control(0),
    nombreProducto: this.fb.control(''),
    totalRecibido: this.fb.control(0),
    cambio: this.fb.control(0),
    noComprobante: [''],
    observacionPago: [''],
    idDocumento: this.fb.control(null)
    // totalRecibido: [''],
    // cambio: ['']

    // Asegúrate de que los formularios anidados se definan aquí


  })
  editando: boolean = false;
  idProducto: number = 0;
  nombre: string = "";
  cantidad: number = 0;
  precio: number = 0;
  descuento: number = 0;
  impuestos: number = 0;
  subTotal: number = 0;
  cambio: number = 0;
  total: number = 0;
  identificacion: string = "jonas dia";
  telefono: string = "";
  efectivo: number = 0;
  editDatils: boolean = false;
  dataListNumeracion: idNumeracion[] = [];
  dataListVendedores: iVendedor[] = [];
  dataListDetalleFactura: iDetalleFactura[] = [];
  DetalleFactura: iDetalleFactura = {
    idDetalleFactura: 0,
    nombre: "",
    descuentoProcentual: 0,
    idFactura: 0,
    idProducto: 0,
    cantidad: 0,
    precio: 0,
    subTotal: 0,
    descuento: 0,
    impuestos: 0,
    total: 0,
    productoObj: null,
    producto: null
  };
  subTotalGeneral: number = 0;
  descuentoGeneral: number = 0;
  totalGeneral: number = 0;
  descuentoPorcentual: number = 0;
  impuestosGenerales: number = 0;
  dataListTerminos: iTermino[] = [];
  dataListContactos: iContactoPos[] = [];
  dataListProductosSearch: iProducto[] = [];
  fechaVenvimiento: any;
  dataListImpuestosDetails: iiMpuesto[] = [];
  totalApagar: number = 0;
  descripcionPago: string = "POR PAGAR";
  dataListBancos: iBanco[] = [];
  dataSource = new MatTableDataSource<iDetalleFactura>(this.dataListDetalleFactura);
  facturaForEdit!: iFactura;


  addDetails() {
    //  this.cantidad = this.miFormulario.value.cantidad;
    let cantLocal = 0;
    if (this.idProducto == 0) {
      this.alertaService.warnigAlert("Debe seleccionar un item y llenar los campos para poder agregar.")
    }
    else {
      let detalle: iDetalleFactura = {
        nombre: this.nombre
        , idProducto: this.idProducto
        , idDetalleFactura: 0
        , cantidad: this.cantidad
        , precio: this.precio
        , descuento: this.descuento
        , descuentoProcentual: this.descuentoPorcentual
        , subTotal: this.subTotal
        , impuestos: this.impuestoProduct * this.cantidad
        , total: this.total
        , productoObj: this.prodcutoSeleccionado
        , producto: this.prodcutoSeleccionado
      }

      let proExit = this.dataListDetalleFactura.find(c => c.idProducto == detalle.idProducto)
      if (proExit !== undefined) {
        this.dataListDetalleFactura = this.dataListDetalleFactura.filter(c => c.idProducto != proExit.idProducto)
        proExit.idDetalleFactura = 0;
        proExit.cantidad += this.cantidad;
        proExit.precio = this.precio;
        proExit.descuento += this.descuento;
        proExit.descuentoProcentual += this.descuentoPorcentual;
        proExit.subTotal += this.subTotal;
        proExit.impuestos += this.impuestos;
        proExit.total += this.total;
        this.dataListDetalleFactura.push(proExit)
        this.subTotalGeneral += proExit.cantidad;
        cantLocal = proExit.cantidad;
      }
      else {
        cantLocal = detalle.cantidad;
        this.dataListDetalleFactura.push(detalle);
      }
      this.dataSource.data = this.dataListDetalleFactura;
      this.calculoGeneral();
      this.editando = false;
      this.resetDetails();

    }

  }
  async removeItem(indice: number, detalle: iDetalleFactura) {
    if (this.editando) {
      this.alertaService.warnigAlert("Esta editando una fila, debe finalizar una edicion para afectar otro registro.");
    }
    else if (await this.alertaService.questionDelete()) {
      this.dataListDetalleFactura.splice(indice, 1);
      this.dataSource.data = this.dataListDetalleFactura;
      this.resetDetails();
      this.calculoGeneral();
      console.log(this.dataListDetalleFactura)
      this.dataListImpuestosDetails = this.dataListImpuestosDetails.filter(c => c.idProducto != detalle.idProducto);
    }
  }

  searchContacto(event: any) {
    let valor = (event.target as HTMLInputElement).value;
    if (valor.length > 0) {
      this.contactoService.getAllFilter((event.target as HTMLInputElement).value, this.informationService.idEmpresa).subscribe((data: ServiceResponse) => {
        this.dataListContactos = data.data.filter((c: iContactoPos) => c.idTipoContacto != 2);
      })
    }
    else {
      this.getAllContactos();
    }
  }

  getAllContactos() {
    this.contactoService.getAll(this.informationService.idEmpresa).subscribe((data: ServiceResponse) => {
      this.dataListContactos = data.data.filter((c: iContactoPos) => c.idTipoContacto != 2);
      this.setDefaultContacto();

    })
  }
  getAllProduct() {
    this.showLoader();
    this.productoService.getAll(this.informationService.idSucursal).subscribe((data: ServiceResponse) => {
      if (data.status) {
        this.dataListProductosSearch = data.data;
        this.showLoader();
      }
    })
  }

  setDefaultContacto() {
    if (this.miFormulario.value.idFactura == undefined) {
      let contacto = this.dataListContactos.find(c => c.predeterminado == true);
      this.selectContacto(undefined, contacto);
    }

  }

  searchProducto(event: any) {
    this.showLoader();
    let valor = (event.target as HTMLInputElement).value;
    if (valor.length > 0) {
      this.productoService.getAllFilterForDocument((event.target as HTMLInputElement).value).subscribe((data: ServiceResponse) => {
        this.dataListProductosSearch = data.data;
        this.showLoader();
      })
    } else {
      this.getAllProduct();
    }
  }

  selectProductoByCodeBar(event: any) {
    if (event.key == 'Enter' && this.codeBar == true) {
      this.seletProductPos(undefined, this.dataListProductosSearch[0])
    }


  }




  searchProductoEdit(valor: string, cant: number) {

    if (valor.length > 0) {
      this.productoService.getAllFilterForDocument(valor).subscribe((data: ServiceResponse) => {
        this.dataListProductosSearch = data.data;
        this.impuestoProduct = Math.round((data.data[0].precioFinal - data.data[0].precioBase) * 100) / 100;
        this.miFormulario.patchValue({ producto: data.data[0], impuesto: this.impuestoProduct * cant })
      })
    }
  }


  displayFn(contacto?: iContactoPos): string | undefined | any {
    return contacto ? contacto.nombreRazonSocial : undefined;
  }

  displayFnProducto(producto?: iProducto): string | undefined | any {
    return producto ? producto.nombre : undefined;
  }

  getTipoDocumentos() {
    this.numeracionService.getAllTipoDocumentos().subscribe((data: ServiceResponse) => {
      if (data.status && this.informationService.tipoDocumento !== "Cotización") {
        this.miFormulario.patchValue({
          idTipoDocumento: data.data.find((c: iTipoDocumento) => c.nombre.toUpperCase().includes("FACTURA DE VENTA")).idTipoDocumento,

        })
      }
      else {
        this.miFormulario.patchValue(
          {
            idTipoDocumento: data.data.find((c: iTipoDocumento) => c.nombre.toUpperCase().includes("COTIZAC")).idTipoDocumento,
            idNumeracion: 11
          })
      }

    })


  }

  selectContacto(event: any, valor?: any) {
    let currentValue = valor == undefined ? event.option.value : valor;
    this.miFormulario.patchValue({
      identificacion: currentValue.rnc,
      telefono: currentValue.telefono1,
      idNumeracion: this.informationService.tipoDocumento === "Cotización" && this.idTipoDocumento!=1 ? 11 : currentValue.idTipoNumeracion,
      idContacto: currentValue.idContacto,
      nombreClienteCompleto: currentValue
    })
    this.idNumeracion = this.informationService.tipoDocumento === "Cotización" ? 11 : currentValue.idTipoNumeracion;
  }

  selectProducto(event: any, accion: number, producto: any = undefined) {
    if (accion == 1) {
      this.idProducto = event.option.value.idProducto;
      this.nombre = event.option.value.nombre;
      this.prodcutoSeleccionado = event.option.value;
      this.cantidad = this.miFormulario.value.cantidad;
      this.precio = event.option.value.precioBase;
      this.impuestos = event.option.value.precioFinal - event.option.value.precioBase;
      this.impuestoProduct = this.impuestos;
      this.descuento = event.option.value.descuento == undefined ? 0 : event.option.value.descuento;
      this.subTotal = (this.cantidad * this.precio);
      this.total = (this.subTotal + this.impuestos) - this.descuento;
      this.miFormulario.patchValue(
        {
          cantidad: this.miFormulario.value.cantidad,
          descripcion: event.option.value.descripcion,
          precio: event.option.value.precioBase,
          // impuesto: Math.round((event.option.value.precioFinal - event.option.value.precioBase) * 100) / 100,
          impuesto: this.impuestos,
          subTotalDetails: this.subTotal,
          descuento: this.descuento,
          total: this.total
        })
    } else if (accion == 2) {
      this.cantidad = 1;
      this.idProducto = producto.idProducto!;
      this.nombre = producto.nombre;
      this.prodcutoSeleccionado = producto;
      this.precio = producto.precioBase;
      this.subTotal = (this.cantidad * this.precio);
      this.total = (this.subTotal + this.impuestos) - this.descuento;
      this.impuestos = producto.precioFinal - producto.precioBase;
      this.impuestoProduct = this.impuestos;
      this.total = (this.subTotal + this.impuestos) - this.descuento;


      // let cantProductoFind = this.dataListDetalleFactura.find(c=>c.idProducto==producto.idProducto)?.cantidad;
      // cantProductoFind = cantProductoFind==undefined? 1 : cantProductoFind + 1 ;
      // alert(cantProductoFind)

      this.miFormulario.patchValue(
        {
          cantidad: 1,
          descripcion: producto.descripcion,
          precio: producto.precioBase,
          impuesto: this.impuestos,
          subTotal: this.subTotal,
          total: this.total
        })
    }

  }

  seletProductPos(event: any, producto: any) {
    this.miFormulario.patchValue({ cantidad: 1 })
    this.selectProducto(event, 2, producto);
    this.addDetails();
  }

  changeCant(evento: any, idProducto: number) {
    this.dataListDetalleFactura.forEach(element => {
      if (element.idProducto == idProducto) {
        element.cantidad = parseInt(evento.target.value);
        element.descuento = element.descuento * element.cantidad;
        element.subTotal = (element.cantidad * element.precio);
        element.total = (element.subTotal + element.impuestos) - element.descuento
      }
    });
    this.calculoGeneral();
    // this.cantidad = evento.target.value;
    // this.cantidad = this.cantidad + evento.target.value


  }

  habilitarDescuentos() {
    this.desc = this.desc == false ? true : false;
    if (this.desc == false) {
      this.dataListDetalleFactura.forEach(element => {
        element.descuento = 0;
        element.subTotal = (element.cantidad * element.precio);
      });
    }
  }
  aplyDesc(evento: any, idProducto: number) {
    this.dataListDetalleFactura.forEach(element => {
      if (element.idProducto == idProducto) {
        element.descuento = (parseInt(evento.target.value) / 100) * (element.cantidad * element.precio);
        element.subTotal = (element.cantidad * element.precio);
        element.total = (element.subTotal + element.impuestos) - element.descuento
      }
    });
    this.calculoGeneral();
  }






  selectProductoById(producto: any, impuestos: any) {
    this.idProducto = producto.idProducto!;
    this.nombre = producto.nombre;
    this.miFormulario.patchValue(
      {
        cantidad: this.miFormulario.value.cantidad,
        descripcion: producto.descripcion,
        precio: producto.precioBase,
        impuesto: Math.round((producto.precioFinal - producto.precioBase) * 100) / 100
      })
    this.calcular();
  }
  selectProductoForEdit(item: iDetalleFactura) {
    this.idProducto = item.idProducto;
    this.nombre = item.nombre;
    this.miFormulario.patchValue(
      {
        cantidad: item.cantidad,
        nombre: item.nombre,
        precio: item.precio,

      })
    this.calcular();
  }

  getById(idFactura: number | any) {
    this.alertaService.ShowLoading();
    this.facturaServcie.getById(idFactura).subscribe((data: ServiceResponse) => {
      if (data.status) {
        this.facturaForEdit = data.data;
        this.miFormulario.reset(this.facturaForEdit);
        this.alertaService.hideLoading();
        this.editarFactura(data.data)
      }
    })
  }


  getAllTerminos() {
    this.plazoService.getAll().subscribe((data: ServiceResponse) => {
      this.dataListTerminos = data.data;
      let dateNow = new Date();
      this.miFormulario.patchValue({ idTermino: data.data.find((c: iTermino) => c.predeterminado == true).idTermino })
      this.setVencimiento();
      console.log(this.activePayment)
      this.btnPagar = data.data.find((c: iTermino) => c.predeterminado == true).idTermino;
      // if (this.btnPagar == 9)
      //   this.setMetodoPago(1, 'EFECTIVO', 0)
    })
  }


  calVencimiento(fecha: Date, dias: any) {
    return addDays(this.miFormulario.value.fecha, dias);
  }

  getAllNumeracion() {
    this.numeracionService.getAll().subscribe((data: ServiceResponse) => {
      this.dataListNumeracion = data.data;
      if (this.facturaServcie.facturaEdit == undefined) {
        // this.miFormulario.patchValue({ "idNumeracion": (data.data.find((c: idNumeracion) => c.predeterminada == true)).idNumeracion })
      }
    })
  }

  setVencimiento(event: any = null) {

    let dias = this.dataListTerminos.find((c: iTermino) => c.idTermino == this.miFormulario.value.idTermino)?.dias;
    let fechaVencimiento = this.calVencimiento(this.miFormulario.value.fecha, dias);
    // let fechaFormateada = this.datePipe.transform(fechaVencimiento, 'yyyy-MM-dd hh:mm:ss');
    let fechaFormateada = fechaVencimiento;
    this.miFormulario.patchValue({ vencimiento: fechaFormateada })
    this.btnPagar = event != undefined ? event.value : 0;

  }

  getAllVendedores() {
    this.vendedoresService.getAll().subscribe((data: ServiceResponse) => {
      this.dataListVendedores = data.data;
    })
  }
  // El metodo calcular calcula los totales del proudcto que se esta agregando
  calcular() {
    if (this.miFormulario.value.cantidad > 0 && this.miFormulario.value.cantidad !== "" && this.miFormulario.value.descuento !== "") {
      this.cantidad = this.miFormulario.value.cantidad;
      this.precio = this.miFormulario.value.precio;
      this.subTotal = this.cantidad * this.precio;
      this.impuestos = this.impuestoProduct * this.cantidad;
      this.descuento = (this.miFormulario.value.descuento / 100) * this.subTotal;
      this.total = this.subTotal + (this.impuestoProduct * this.cantidad) - this.descuento;
      this.miFormulario.patchValue({ subTotalDetails: this.subTotal, total: this.total, impuesto: this.cantidad == 1 ? this.impuestoProduct : this.impuestoProduct * this.cantidad })
    }
    else {
      this.miFormulario.patchValue({ descuento: 0, cantidad: 1, impuesto: this.impuestoProduct });
    }
  }


  onPayment() {
    this.activePayment = this.activePayment === false ? true : false;
  }



  contador = 0;
  calculoGeneral() {
    let a = 0; let b = 0; let e = 0; let i = 0;
    this.dataListDetalleFactura.forEach(c => {
      a += c.subTotal;
      b += c.descuento;
      e += c.total;
      i += c.impuestos;
    })
    this.dataSource.data = this.dataListDetalleFactura;
    this.subTotalGeneral = a;
    this.descuentoGeneral = b;
    this.totalGeneral = e;
    this.totalApagar = e;
    this.impuestosGenerales = i;
    console.log(this.miFormulario.value)
    if (this.dataListDetalleFactura.length < 1) {
      this.subTotalGeneral = 0;
      this.descuentoGeneral = 0;
      this.totalGeneral = 0;
      this.totalApagar = 0;
      this.cambio = 0;
      this.impuestosGenerales = 0;
    }
  }


  resetDetails() {
    this.editando = false;
    this.cantidad = 1;
    this.precio = 0;
    this.subTotal = 0;
    this.impuestos = 0;
    this.total = 0;
    this.descuento = 0;
    this.idProducto = 0;
    this.miFormulario.patchValue(
      {
        precio: 0,
        descuento: 0,
        subTotalDetails: 0,
        impuesto: 0,
        total: 0, producto: "",
        cantidad: 1,
      })
  }


  editRow(item: iDetalleFactura, index: number) {
    if (this.editando == true) {
      this.alertaService.warnigAlert("Esta editando una fila, debe finalizar una edicion para afectar otro registro.");
    }
    else {
      this.prodcutoSeleccionado = item.productoObj;
      this.editando = true;
      this.idProducto = item.idProducto;
      this.searchProductoEdit(item.nombre, item.cantidad);
      this.calcular();
      this.miFormulario.patchValue({
        cantidad: item.cantidad,
        descuento: this.descuentoPorcentual,
        precio: item.precio,
        subTotal: item.subTotal,
        subTotalDetails: item.subTotal,
        total: item.total
      })
      this.selectProductoById(item.producto, item.impuestoObj);
      this.dataListDetalleFactura.splice(index, 1);
      this.calculoGeneral();


    }
  }

  setMiFormulario() {
    console.log(this.document)
    console.log(this.idTipoDocumento)
    console.log(this.miFormulario.value.idFactura)
    console.log(this.miFormulario.value.idDocumento)

    this.miFormulario.patchValue({
      detalle: this.dataListDetalleFactura,
      idEmpresa: this.usuarioService.usuarioLogueado.data.sucursal.idEmpresa,
      idSucursal: this.usuarioService.usuarioLogueado.data.sucursal.idSucursal,
      idUsuario: this.usuarioService.usuarioLogueado.data.idUsuario,
      descuento: this.descuentoGeneral,
      subTotal: this.subTotalGeneral,
      totalGeneral: this.totalGeneral,
      itbis: this.impuestosGenerales,
      impuestos: this.miFormulario.value.impuestoObjet,
      idNumeracion: this.idNumeracion,
      idFactura : this.document=="Cotización" && this.idTipoDocumento==1? null : this.miFormulario.value.idFactura
      
      // idTipoDocumento: this.miFormulario.value.idDocumento == undefined || this.miFormulario.value.idDocumento == null ? this.miFormulario.value.idDocumento : 1
    })
  }

  guardarFactura() {
    this.setMiFormulario();
    console.log(this.miFormulario.value)
    if (this.miFormulario.valid && this.dataListDetalleFactura.length > 0) {
      this.alertaService.ShowLoading();
      if (this.miFormulario.value.idFactura !== null && this.miFormulario.value.idDocumento == undefined) {
        this.facturaServcie.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
          if (data.status) {
            this.alertaService.successAlert(data.message);
            this.resetHeader();
            this.resetDetails();
            this.resetFormPago()
            this.setDefaultContacto();
          }
          else {
            this.alertaService.errorAlert(data.message);
          }
        })
      }
      else {
        this.facturaServcie.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
          if (data.statusCode == 200) {
            this.alertaService.successAlert(data.message);
            this.resetHeader();
            this.resetDetails();
            this.resetFormPago();
            this.setDefaultContacto();
          }
          else {
            this.alertaService.errorAlert(data.message);
          }
        })
      }
    }
    else {
      this.alertaService.warnigAlert("Debe completar todos para poder guardar el documento");
    }
  }


  //Este metodo siver para limpiar todo despues de hacer un insercion
  async resetData(accion: number) {
    if (accion == 1) {
      this.addDetails();
    }
    if (await this.alertaService.question("Esta seguro que desea cancelar?, si lo hace todos los datos que ha insertado se eliminara")) {
      this.resetDetails();
      this.resetHeader();
    }
  }



  resetHeader() {
    this.dataSource.data = [];
    this.dataListDetalleFactura = [];
    this.miFormulario.patchValue({
      cantidad: 1,
      precio: 0,
      subTotalDetails: 0,
      impuesto: 0,
      descuento: 0,
      total: 0,
      producto: "",
      comenatrios: "",
      telefono: "",
      identificacion: "",
      idContacto: "",
      nombreClienteCompleto: "",
      comentario: "",
      idFactura: null,
      itbis: 0

    })
    this.totalGeneral = 0;
    this.subTotalGeneral = 0;
    this.descuentoGeneral = 0;
    this.dataListImpuestosDetails = [];
    this.facturaServcie.facturaEdit = null;
    this.impuestosGenerales = 0;
  }

  //Selecciona un metodo de pago
  setMetodoPago(metodo: number, descripcion: string, index: number) {
    if (this.dataListDetalleFactura.length > 0) {
      this.miFormulario.patchValue({ firstCtrl: 'metodo' })
      this.metodoPagoSeleccionado = descripcion;
      this.setActive(index);
      if (descripcion.toUpperCase() !== "EFECTIVO") {
        this.dataListBancos = this.dataListBancos.filter(c => c.tipoCuenta.nombre.toUpperCase() !== "EFECTIVO");
      }
      else {
        this.getAllBancos();
      }
      if (metodo == 1) {
        this.openModalPayCash();
      }
    } else {
      this.alertaService.errorAlert("Debe seleccionar los productos y el cliente para poder procesar esta transacción.")

    }

  }

  // Valida el formulario para que este no se envie si no se ha seleccionado un metodo de pago
  validSetFirsForm() {
    if (this.miFormulario.invalid) {
      this.alertaService.warnigAlert('Seleccione un metodo de pago');
    }
  }

  activeIndex: number | null = null;

  setActive(index: number) {
    this.activeIndex = index;
  }

  calcularPagoEfectivo(event: any, monto: number = 0) {
    let montoResult = monto !== 0 ? monto : event.target.value;
    this.cambio = this.totalApagar - montoResult;
    let totalRecibido = montoResult;
    this.addMontoPagar(montoResult);
    this.descripcionPago = this.cambio < 0 ? "CAMBIO" : "POR PAGAR";
    this.cambio = this.cambio < 0 ? (this.cambio * -1) : this.cambio;
    this.miFormulario.patchValue({ cambio: this.cambio, totalRecibido: montoResult, montoPagado: montoResult })
    console.log(this.miFormulario.value)
  }

  getAllBancos() {
    this.bancoService.getAll(this.usuarioService.usuarioLogueado.data.sucursal.idSucursal).subscribe((c: ServiceResponse) => {
      this.dataListBancos = c.data;
    })
  }

  addMontoPagar(event: any) {
    event > 0 ? this.miFormulario.patchValue({ montoPagado: this.efectivo }) : 0;
  }

  resetFormPago() {
    this.metodoPagoSeleccionado = '';
    this.activePayment = false;
  }

  pagarFactura() {
    this.miFormulario.valid === true ? this.guardarFactura() : this.alertaService.warnigAlert("Debe completar los campos para poder aplicar el pago y guardar la factura.")
  }
  closeModal() {
    console.log('cerrando')
    $('#exampleModal').modal('hide');
  }

  openModal() {
    console.log('cerrando')
    $('#exampleModal').modal('show');
  }

  retroceder() {
    if (this.facturaServcie.document === "Cotización") {
      this.router.navigate(['/sales/pricelist'])
    }
    else {
      this.router.navigate(['/sales/salelist'])

    }
  }


  //Este codigo de aqui  en adelante es del post
  codeBar: boolean = false;
  seelctMetodFilter(value: number) {
    if (value == 1)
      this.codeBar = true;
    else
      this.codeBar = false;
  }


  openModalPayCash() {
    if (this.miFormulario.value.idContacto != '' && this.dataListDetalleFactura.length > 0) {
      this.dialog.open(PaymenSalesComponent, {
        data: {
          montoPagar: this.totalGeneral
        }
      }).afterClosed().subscribe(result => {
        if (result != undefined) {

          this.calcularPagoEfectivo(undefined, result.value.totalRecibido);
          this.guardarFactura();
        }
      })
    } else {
      this.alertaService.errorAlert("Debe seleccionar los productos y el cliente para poder procesar esta transacción.")
    }

  }

  showLoader() {
    this.loader == this.loader == true ? false : true;
  }


}
