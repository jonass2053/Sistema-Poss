import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPrintService } from 'ngx-print';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { iDetalleFactura, iFactura, iiMpuesto, iPago } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { FacturaService } from 'src/app/services/factura.service';
import { InformationService } from 'src/app/services/information.service';
import { PagosService } from 'src/app/services/pagos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-view-sales',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './view-sales.component.html',
  styleUrl: './view-sales.component.scss'
})
export class ViewSalesComponent {
  factura!: iFactura;
  idFactura!: number;
  pagosDataList: iPago[] = [];
  moneda: string = "";
  dataListIMpuestos: iiMpuesto[] = [];
  cargando = true;
  verFactura = true;
  dialog = inject(MatDialog);
  displayedColumns: string[] = ['item', 'descripcion', 'cantidad', 'precio', 'subtotal', 'itbis', 'descuento', 'total'];
  dataSource = new MatTableDataSource<iDetalleFactura>();


  constructor(
    private facturaService: FacturaService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private alertas: AlertServiceService,
    private pagosService: PagosService,
    private printService: NgxPrintService,
    private router: Router,
    public informationService : InformationService

  ) {
    route.paramMap.subscribe((params: any) => {
      this.idFactura = params.get("id")
    })
    alertas.ShowLoading();
    facturaService.getById(this.idFactura).subscribe((r: ServiceResponse) => {
      this.factura = r.data;
      facturaService.facturaEdit = this.factura;
      this.dataSource.data = r.data.detalle;
    });


    pagosService.getByIdFactura(this.idFactura).subscribe((r: ServiceResponse) => {
      this.pagosDataList = r.data;
      this.dataSource.data=r.data.detalle;
    })

    this.moneda = usuarioService.usuarioLogueado.data.sucursal.empresa.moneda.simbolo
    setTimeout(() => {
      this.cargando = false;
      this.alertas.hideLoading();
    }, 1000);
  }

  async deletPago(idPago: number) {
    if (await this.alertas.questionDelete()) {
      this.pagosService.delete(idPago).subscribe((data: ServiceResponse) => {
        this.alertas.successAlert(data.message)
        location.reload();
      })
    }
  }

  printFactura(factura: iFactura) {
    // const customPrintOptions: PrintOptions = new PrintOptions({
    //   printSectionId: 'print-section',
    //   printTitle: "Factura",
    //   useExistingCss: true,
    //   openNewTab: false,
    //   previewOnly: false,
    //   closeWindow: true,
    //   printDelay: 10
    

    //   // Add any other print options as needed
    // });
    // this.printService.print(customPrintOptions)
    this.prtinReportPdf();
  }


  prtinReportPdf() {
    // var ref = this.dialog.open(FacturaReportComponent, { hasBackdrop: true })
  }

  editar(Factura: iFactura) {
    if (Factura.montoPorPagar === 0) {
      this.alertas.warnigAlert("La factura no se puede editar Ten en cuenta que para editarla no puede estar cancelada o tener algún pago asociado.")
    }
    else {
      this.facturaService.getById(Factura.idFactura!).subscribe((data: any) => {
        this.facturaService.facturaEdit = data.data;
        this.router.navigateByUrl('layout/factura');
        this.alertas.hideLoading();

      })
    }
  }

  retroceder() {
    if (this.facturaService.document === "Cotización") {
      this.router.navigate(['/sales/pricelist'])
    }
    else {
      this.router.navigate(['/sales/salelist'])

    }
  }
}
