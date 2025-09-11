import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { MsjService } from 'src/app/Core/utilities/msj.service';
import { iContactoPos, iMoneda, iPago } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { AlmacenService } from 'src/app/services/almacen.service';
import { FacturaService } from 'src/app/services/factura.service';
import { ImpuestosService } from 'src/app/services/impuestos.service';
import { InformationService } from 'src/app/services/information.service';
import { MarcasService } from 'src/app/services/marcas.service';
import { ModelosService } from 'src/app/services/modelos.service';
import { PagosService } from 'src/app/services/pagos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { PayComponent } from './pay/pay.component';
import { Router } from '@angular/router';
import { ContactosService } from 'src/app/services/contactos.service';
import { PrintServiceService } from 'src/app/services/print-service.service';
import { NodataComponent } from '../nodata/nodata.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    importaciones,
    NodataComponent
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  constructor(
    private fb: FormBuilder,
    private alertaService: AlertServiceService,
    private msjService: MsjService,
    private pagoService: PagosService,
    private impuestoService: ImpuestosService,
    private almacenService: AlmacenService,
    private usuarioService: UsuarioService,
    private marcaService: MarcasService,
    private modeloService: ModelosService,
    public informationService: InformationService,
    private facturaService: FacturaService,
    private router: Router,
    private contactoService: ContactosService,
    private printService: PrintServiceService

  ) {

    this.getAll();
    this.moneda = this.usuarioService.usuarioLogueado.data.sucursal.empresa.moneda;
  }

  displayFn(contacto?: iContactoPos): string | undefined | any {
    return contacto ? contacto.nombreRazonSocial : undefined;
  }
  noData: boolean = false;
  showFiller = false;
  desde: any;
  hasta: any;
  totalMontoPagado = 0;
  dataListContactos: iContactoPos[] = [];
  dialog = inject(MatDialog);
  moneda!: iMoneda;
  cargando: boolean = false;
  sinRegistros: boolean = false;
  dataList: iPago[] = [];
  sinRegistrosTxt: String = "No se ha encontrado ningun registro."
  displayedColumns: string[] = ['idPago', 'cliente', 'tipoDocumento', 'fecha', 'cuenta', 'monto', 'acciones'];
  filters: boolean = false;
  miFormulario: FormGroup = this.fb.group({
    idNumeracion: this.fb.control(null),
    desde: this.fb.control(null),
    hasta: this.fb.control(null),
    no: this.fb.control(null),
    idContacto: this.fb.control(null),
    idEstado: this.fb.control(null),
    nombreClienteCompleto: this.fb.control(''),
  });


  async delete(id: any) {
    if (await this.alertaService.questionDelete()) {
      this.alertaService.ShowLoading();
      this.pagoService.delete(id).subscribe(((data: ServiceResponse) => {
        if (data.status) {
          this.alertaService.successAlert(data.message);
          this.getAll();
          this.setNoData(data.data.length > 0 ? true : false);
        }
        else {
          this.alertaService.errorAlert(data.message)
        }
      }))
    }
  }

  getAll() {
    this.cargando=true;
    this.pagoService.getAll(this.informationService.idSucursal).subscribe((data: ServiceResponse) => {
      this.dataList = data.data;
      this.cargando=false;
      this.setNoData(data.data.length > 0 ? true : false);
      this.totalMontoPagado = data.totalMontoPagado;
      // this.alertaService.hideLoading();
    })
  }

  setNoData(value: boolean) {
    this.noData = value;
    this.cargando=false;
  }

  editar(pago: any) {
    this.pagoService.facturaPagar = pago.facturaObj;
    this.pagoService.pagoForEdit = pago;
    var ref = this.dialog.open(PayComponent, { hasBackdrop: true })
    ref.beforeClosed().subscribe(c => {
      this.getAll();
      this.pagoService.pagoForEdit.idPago = 0;
    })
  }

  selectContacto(event: any, valor?: any) {
    let currentValue = valor == undefined ? event.option.value : valor;
    this.miFormulario.patchValue({
      idContacto: currentValue.idContacto,
      nombreClienteCompleto: currentValue
    })
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


  //  Metodo para darle formato a la fecha antes de enviarla
  setFormatDate() {
    let desdeOri: Date | null = this.miFormulario.value.desde ? new Date(this.miFormulario.value.desde) : null;
    let hastaOri: Date | null = this.miFormulario.value.hasta ? new Date(this.miFormulario.value.hasta) : null;
    if (desdeOri != undefined && hastaOri != undefined) {
      this.desde = `${desdeOri?.getFullYear()}-${(desdeOri?.getMonth()!) + 1}-${desdeOri?.getDate()}`;
      this.hasta = `${hastaOri?.getFullYear()}-${(hastaOri?.getMonth()!) + 1}-${hastaOri?.getDate()}`;
    }
  }


  // Buscar Todos Los contactos
  getAllContactos() {
    this.contactoService.getAll(this.informationService.idEmpresa).subscribe((data: ServiceResponse) => {
      this.dataListContactos = data.data.filter((c: iContactoPos) => c.idTipoContacto != 2);

    })
  }
  //Filtrar los contactos
  getAllFilter() {
    const { no, desde, hasta, idNumeracion, idContacto, idEstado } = this.miFormulario.value;
    this.cargando = true;
    this.setFormatDate();
    // Verificar si todos están vacíos, y solo así ejecutar getAll
    const todosVacios = [no, desde, hasta, idNumeracion, idContacto, idEstado].every(
      valor => valor === undefined || valor === null || (typeof valor === 'string' && valor.trim() === '')
    );

    if (todosVacios) {
      this.getAll();
    }
    else {
      this.cargando = true;
      this.pagoService.getAllFilter(this.informationService.idSucursal, this.miFormulario.value).subscribe((data: any) => {
      this.dataList = data.data;
      this.setNoData(data.data.length>0?true:false);
      this.totalMontoPagado = data.totalMontoPagado;

      })
    }
  }


  showLoading() {
    this.cargando = this.cargando === true ? false : true;
  }
  newPay() {
    this.router.navigate(['/payment/newpay']);
  }

  showFilter() {
    this.filters = this.filters == false ? true : false;
  }

  resetFilters() {
    this.miFormulario.reset();
  }

  printRecibo(pago: iPago) {
    this.printService.printReciboPago(pago, this.moneda.simbolo)
  }


}
