import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { iAjusteInventario, iMovimientoProductos, iProducto } from 'src/app/interfaces/iTermino';
import { InformationService } from 'src/app/services/information.service';
import { ProductoService } from 'src/app/services/producto.service';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { NoDataComponent } from 'src/app/components/no-data/no-data.component';
import { C } from '@angular/cdk/keycodes';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { EditAdjustmentComponent } from './edit-adjustment/edit-adjustment.component';


@Component({
  selector: 'app-inventary-adjustment',
  standalone: true,
  imports: [
    importaciones,
    NoDataComponent,
    ConfirmDialogModule
  ],

  templateUrl: './inventary-adjustment.component.html',
  styleUrl: './inventary-adjustment.component.scss'
})
export class InventaryAdjustmentComponent {
  readonly dialog = inject(MatDialog);
  constructor(
    private productoService: ProductoService,
    private informationService: InformationService,
    private alertaService: AlertServiceService,
    private fb: FormBuilder

  ) {
    this.getAll();
    this.getAllAjustes();
    this.getMovimientosProductos();
  }
  rangeDates: Date[] | undefined;
  visible: boolean = false;
  showDialog() {
    this.visible = true;
  }

  displayedColumns: string[] = ['imagen', 'idProducto', 'nombre', 'precioBase', 'cantInicial', 'StockAjustado', 'Diferencia', 'Razón del Ajuste', 'accion'];
  displayedColumnsAjustada: string[] = ['idAjuste', 'nombre', 'StockAnterior', 'StockAjustado', 'Diferencia', 'Razón del Ajuste', 'accion'];
  displayedColumnsMovimientos: string[] = ['idMovimiento', 'idProducto', 'nombre', 'isEntrada', 'cantidad', 'referencia', 'fecha'];

  dataList: iProducto[] = [];
  dataListProductosAjustados: iAjusteInventario[] = [];
  dataListMovimietoProductos: iMovimientoProductos[] = [];

  cargando: boolean = false;
  editAjusteDialog(ajuste: iAjusteInventario) {
    ajuste.idSucursal = this.informationService.idSucursal;
    this.dialog.open(EditAdjustmentComponent, {
      data: ajuste, disableClose: true
    }).afterClosed().subscribe(c => {
      this.getAllAjustes();
    });

  }

  desde : any =null;
  hasta : any = null;

  adjustmentReasons = [
    "Inventario físico",
    "Producto dañado",
    "Error de conteo previo",
    "Robo/Pérdida",
    "Devolución de cliente",
    "Otros"
  ]

  //Esta variable controla que tabla se va a mostrar y en que momento
  controlVistasTablas = 0;


  miFormulario: FormGroup = this.fb.group({
    idAjuste: this.fb.control(null),
    idProducto: this.fb.control(''),
    stockActual: this.fb.control(0),
    stockAjustado: this.fb.control(0),
    diferencia: this.fb.control(0),
    razonAjuste: this.fb.control(0),
    createdBy: this.fb.control(0),
    idSucursal: this.fb.control(null)

  })

  formularioFecha: FormGroup = this.fb.group(
    {
      filtro : this.fb.control(""),
      desde: this.fb.control(null, Validators.required),
      hasta: this.fb.control(null, Validators.required),
    }
  )




  ajustar(id: any, event: any) {
    this.dataList.map(c => {
      if (c.idProducto == id) {
        c.diferencia = event.target.value - c.cantInicial;
        c.stockAjustado = c.cantInicial + c.diferencia;

      }
    });
  }

  async saveAjuste(productoAjustado: iProducto) {
    if (await this.alertaService.questionEjecut()) {
      this.alertaService.ShowLoading();
      if (productoAjustado.diferencia < 0) {
        productoAjustado.diferencia = productoAjustado.diferencia * (-1)
      }
      this.miFormulario.patchValue({
        stockActual: productoAjustado.cantInicial,
        createdBy: this.informationService.idUsuario,
        idProducto: productoAjustado.idProducto,
        stockAjustado: productoAjustado.stockAjustado,
        diferencia: productoAjustado.diferencia,
        razonAjuste: productoAjustado.razonAjuste,
        idSucursal: this.informationService.idSucursal
      })
      this.productoService.insertAjusteInventario(this.miFormulario.value).subscribe((data: ServiceResponse) => {
        if (data.status) {
          this.alertaService.successAlert(data.message);
          this.getAll();
        }
      })
    }
  }

  // Este es el filter de los productos para realizar el ajuste pertinentes
  getAllFilter(event: any) {
    const filtro = (event.target as HTMLInputElement).value;
    if (filtro == "") {
      this.getAll();
    }
    else {
      this.loading();
      this.productoService.getAllFilter(filtro).subscribe((data: any) => {
        this.dataList = data.data;
        if (this.dataList.length > 0) {
          this.getAllFilterAjustes(event)
          this.getAllFilterMovimientos(event);
        }
        else {
        }
      })
     
      this.loading();
    }
  }


  //Filter de los movimientos
  getAllFilterMovimientos(event: any) {
    const filtro = this.formularioFecha.value.filtro;
    if (filtro == "") {
      this.getMovimientosProductos();
    }
    else {
      this.loading();
      this.desde=this.formatearFecha(this.formularioFecha.value.desde)==''? null : this.formatearFecha(this.formularioFecha.value.desde);
      this.hasta=this.formatearFecha(this.formularioFecha.value.hasta)==''?null : this.formatearFecha(this.formularioFecha.value.hasta);
      this.productoService.getAllFilterMovimientos(filtro, this.desde, this.hasta).subscribe((data: any) => {
        this.dataListMovimietoProductos = data.data;
        if (this.dataList.length > 0) {
          // this.sinRegistros = false
        }
        else {
          // this.sinRegistros = true;
        }
      })
      this.loading();
    }
  }

  //Filter de los ajustes
  getAllFilterAjustes(event: any) {
    const filtro = this.formularioFecha.value.filtro;
    console.log(filtro)
    if (filtro == "") {
      this.getAllAjustes();
    }
    else {
      this.loading();
      this.desde=this.formatearFecha(this.formularioFecha.value.desde)==''? null : this.formatearFecha(this.formularioFecha.value.desde);
      this.hasta=this.formatearFecha(this.formularioFecha.value.hasta)==''?null : this.formatearFecha(this.formularioFecha.value.hasta);
      this.productoService.getAllFilterAjustes(filtro, this.desde, this.hasta).subscribe((data: any) => {
        this.dataListProductosAjustados = data.data;
        if (this.dataList.length > 0) {
          // this.sinRegistros = false
        }
        else {
          // this.sinRegistros = true;
        }
      })
      this.loading();
    }
  }


  // Este es el metodo que consume los otros filtros dependiendo de en que tabla sea
  // Realizar el ajuste de inventario en la vista de los productos, en la vista de los ajustes ya realizados o en la vista de los movimientos de los productos
  // Estos son con el objetivos de consultas y reportes que le interesen a los clientes


  masterFilter(event: any) {
    if(event.target.value!=null){
      switch (this.controlVistasTablas) {
        case 1:
          this.getAllFilterAjustes(event)
          break;
        case 2:
          this.getAllFilterMovimientos(event)
          break;
        default:
          this.getAllFilter(event)
          break;
      }
    }
  
  }

   formatearFecha(fecha: Date): string {
    if(fecha==null){
      return ''
    }
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minuto = fecha.getMinutes().toString().padStart(2, '0');
    const segundo = fecha.getSeconds().toString().padStart(2, '0');
    return `${año}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
  }


  getAll() {
    this.loading();
    this.productoService.getAll(this.informationService.idSucursal).subscribe((data: any) => {
      this.dataList = data.data;
      this.loading();
      this.resetFormDate();

    })
  }

  getAllAjustes() {
    this.loading();
    this.productoService.GetAjusteInventario(1, 100, this.informationService.idSucursal).subscribe((data: any) => {
      this.dataListProductosAjustados = data.data;
      this.loading();
      this.resetFormDate();

    })
  }
  getMovimientosProductos() {
    this.loading();
    this.productoService.GetAllMovimientoProductos(1, 100, this.informationService.idSucursal).subscribe((data: any) => {
      this.dataListMovimietoProductos = data.data;
      this.loading();
      this.resetFormDate();

    })
  }


  loading() {
    this.cargando = this.cargando == false ? true : false;
  }

  verAjuste(valor: number) {
    this.controlVistasTablas = valor;
  }

  selectRazon(razon: any, idProducto: number) {
    this.dataList.map(c => {
      if (c.idProducto == idProducto) {
        c.razonAjuste = razon.target.value;
      }
    })
  }

  async removerAjuste(idAjuste: number) {
    if (await this.alertaService.questionDelete() == true) {
      this.productoService.deleteAjusteInventario(idAjuste).subscribe((data => {
        if (data.status) {
          this.alertaService.successAlert(data.message);
          this.getAllAjustes();
        }
      }))
    }
  }

  refrescar() {
    this.getAll();
    this.getAllAjustes();
  }

  resetFormDate(){
    this.formularioFecha.reset();
  }

}
