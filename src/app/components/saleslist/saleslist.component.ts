import { Overlay, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { timeout } from 'rxjs';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { MsjService } from 'src/app/Core/utilities/msj.service';
import { iFactura, iMoneda } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { FacturaService } from 'src/app/services/factura.service';
import { GeneratePDFService } from 'src/app/services/generate-pdf.service';
import { InformationService } from 'src/app/services/information.service';
import { PagosService } from 'src/app/services/pagos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { PayComponent } from '../payment/pay/pay.component';
import { ThemePalette } from '@angular/material/core';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
let ELEMENT_DATA: iFactura[] = []
@Component({
  selector: 'app-saleslist',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './saleslist.component.html',
  styleUrl: './saleslist.component.scss'
})
export class SaleslistComponent implements OnInit {

  dataSource = new MatTableDataSource<iFactura>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator; 
    // this.getAll(1, 5); // Cargar los primeros 10 elementos

  }
  color: ThemePalette = 'primary'; // Puede ser 'primary', 'accent', 'warn'
  
  constructor(
    private fb: FormBuilder,
    private alertaService: AlertServiceService,
    private msjService: MsjService,
    private usuarioService: UsuarioService,
    private facturaService: FacturaService,
    private router: Router,
    private overlay: Overlay,
    private sso: ScrollStrategyOptions,
    private pagoService: PagosService,
    private reportService: GeneratePDFService,
    private informacion: InformationService

  ) {

    this.moneda = this.usuarioService.usuarioLogueado.data.sucursal.empresa.moneda;
    facturaService.facturaEdit = undefined;
    this.doc = informacion.tipoDocumento;
    this.getAll(this.pageNumber, this.pageSize); // Cargar los primeros 10 elementos

  }





  displayedColumns: string[] = ['Numero', 'Cliente', 'Creación', 'Vencimiento', 'Total', 'MontoPagado', 'MontoPorPagar', 'Estado', 'Acciones'];

  dialog = inject(MatDialog);
  facturaForPrint: any;
  doc: string = "";
  data = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
  nombreAuthor = 'Juan Perez';
  fechaNow = new Date().toLocaleDateString();



  openDialog(factura: iFactura) {
    if (factura.montoPorPagar > 0) {
      this.pagoService.facturaPagar = factura;
      var ref = this.dialog.open(PayComponent, { width: '750px', hasBackdrop: true });
      ref.beforeClosed().subscribe(c => {
         this.getAll(this.pageNumber, this.pageSize, this.facturaService.document);
      })
    }
    else
      this.alertaService.warnigAlert("Ten en cuenta que no puedes agregar pagos a facturas ya cobrada o canceladas.")
  }

  dataList: iFactura[] = [];
  cargando: boolean = false;
  sinRegistros: boolean = false;
  checked = false;
  moneda!: iMoneda;
  sinRegistrosTxt: string = "";
  paginations: number[] = [1];
  filtro: string = "";
  pageNumber: number = 1;
  pageSize: number = 7;
  totalItems = 0; // Total de elementos que hay en la API
  private previousPageIndex = 0; // Página anterior


  goToNewProduct(idProducto: number) {
    this.router.navigate([`inventary/product/${idProducto}`]);
    // this.productoService.productoForEdit.idProducto = 0;
  }
  async delete(id: any) {
    if (await this.alertaService.questionDelete()) {
      this.alertaService.ShowLoading();
      this.facturaService.delete(id).subscribe(((data: ServiceResponse) => {
        if (data.status) {
          this.alertaService.successAlert(data.message);
          this.getAll(1, 7, this.facturaService.document);
        }
        else {
          this.alertaService.errorAlert(data.message)
        }
      }))
    }
  }

  editar(Factura: iFactura) {
    if (Factura.montoPorPagar === 0) {
      this.alertaService.warnigAlert("La factura no se puede editar Ten en cuenta que para editarla no puede estar cancelada o tener algún pago asociado.")
    }
    else {
      this.cargando = true;
      this.facturaService.getById(Factura.idFactura!).subscribe((data: any) => {
        console.log(data)
        this.facturaService.facturaEdit = data.data;
        this.router.navigateByUrl(`sales/newsale/${Factura.idFactura}`);
      })
    }
  }

  verFactura(idFactura: number) {
    if (this.informacion.tipoDocumento === 'Cotización') {
      this.router.navigateByUrl(`layout/detalle_cotizacion/${idFactura}`);
    }
    else {
      this.router.navigateByUrl(`layout/detalle_factura/${idFactura}`);
    }
  }

  update() {
    this.alertaService.ShowLoading();

  }
  // Función para manejar el cambio de página
  // Método que maneja el cambio de página
  pageChanged(event: any): void {
    console.log('Paginación cambiada:', event);

    // Asegurarse de que el número de página nunca sea 0
    let currentPage = event.pageIndex + 1;  // Aumentamos 1 para que la página comience en 1

    // Calcular el cambio en la página (avance o retroceso)
    if (currentPage > this.previousPageIndex) {
      this.pageNumber += 1;  // Avanzamos una página
    } else if (currentPage < this.previousPageIndex) {
      this.pageNumber -= 1;  // Retrocedemos una página
    }

    // Guardamos el índice de la página actual
    this.previousPageIndex = currentPage;

    // Mostrar el número de página actual para debugging
    console.log('page number:', this.pageNumber);
    this.pageSize = event.pageSize;


    // Llamar al backend con el número de página ajustado y el tamaño de la página
    this.getAll(this.pageNumber, this.pageSize);
  }
  getAll(pageNumber: number, pageSize: number, tipoDocumento: string = "") {
    this.facturaService.getAll(this.usuarioService.usuarioLogueado.data.sucursal.idSucursal, pageNumber, pageSize, this.informacion.tipoDocumento === "Cotización" ? 2 : 1).subscribe((data: ServiceResponse) => {
      this.dataSource.data = data.data; // Asume que la API devuelve los items en 'items'
      this.totalItems = data.totalItems; // Asume que la API también devuelve el total de items
      this.pageSize = pageSize;
      // if (this.paginator) {
      //   this.paginator.length = this.totalItems;  // Establecer el total de registros
      //   this.paginator.pageIndex = pageNumber;   // Establecer el índice de la página actual
      // }
      if (this.dataList.length > 0) {
        this.sinRegistros = false
        this.cargando = false;
      }
      else {
        this.sinRegistros = true;
        this.sinRegistrosTxt = data.message;
        this.cargando = false;
      }
    })
  }



  getAllFilter(event: any) {
    const filtro = (event.target as HTMLInputElement).value;
    this.filtro = filtro;
    if (filtro == "") {
      this.getAll(this.pageNumber, this.pageSize, 'Factura');
    }
    else {
      this.cargando = true;
      this.facturaService.getAllFilter(this.informacion.idSucursal, filtro, this.informacion.tipoDocumento === "Cotización" ? 6 : 1, this.pageNumber, this.pageSize).subscribe((data: any) => {
        this.dataList = data.data;
        this.dataSource.data = data.data;

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

  // loadPaginacion(valu: number) {
  //   this.paginations = [];
  //   for (let i = 1; i < valu + 1; i++) {
  //     this.paginations.push(i)
  //     console.log(i)
  //   }

  // }

  // getFacturaByIdForPrint(idFactura: number) {

  //   this.facturaService.getById(idFactura!).subscribe((data: ServiceResponse) => {
  //     this.facturaForPrint = data.statusCode == 200 ? data.data : undefined;
  //     this.facturaService.facturaEdit = this.facturaForPrint;
  //     this.prtinReportPdf();

  //     setTimeout(() => {
  //       this.printTres();

  //     }, 2000);
  //   })


  // }



  // printFactura() {
  //   const customPrintOptions: PrintOptions = new PrintOptions({
  //     printSectionId: 'print-section',
  //     printTitle: "Factura",
  //     useExistingCss: true,
  //     openNewTab: false,
  //     previewOnly: false,
  //     closeWindow: true,
  //     printDelay: 10,
  //   });
  //   this.printService.print(customPrintOptions)
  // }

  //  Prueba de implementacion de generacion de reportes via pdf
  // prtinReportPdf(){
  //   var ref = this.dialog.open(FacturaReportComponent, { hasBackdrop: true })
  //   ref.beforeClosed().subscribe(c => {
  //     this.getAll(1,10,this.facturaService.document);
  //   });


  // this.reportService.generatePDF('print-section', 'mi-documento.pdf');

  // const element: HTMLElement = document.getElementById('print-section')!;
  // html2canvas(element, {scale:3, useCORS: true}).then(canvas => {
  //   const imgData = canvas.toDataURL('image/png');
  //   const pdf = new jsPDF('p', 'mm', 'letter');

  //   // Ajustar imagen al tamaño de la página
  //   const imgWidth = 216; // A4 width en mm
  //   const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //   pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

  //   // Generar Blob y abrir en una nueva ventana
  //   const pdfBlob = pdf.output('blob');
  //   const url = URL.createObjectURL(pdfBlob);
  //   window.open(url, '_blank');
  // });
  // }

  addNewDocument(idDocument : number) {
    if (this.facturaService.document === "Cotización") {
      this.router.navigate([`sales/newprice/${idDocument}`]);
    }
    else {
      this.router.navigate([`sales/newsale/${idDocument}`]);
    }
  }



  printTres() {
    const element = document.getElementById('print-section');
    console.log(element)
    if (element !== null) {
      // Accedes al elemento sin el error de null
      const divContent = element.innerHTML;
      // Procede con tu lógica aquí

      var docDefinition = {
        content: [
          { text: divContent, fontSize: 12 }
        ]
      };
    }
  }


  public generatePDF(): void {
    const pdf = new jsPDF('p', 'mm', 'letter');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const logoWidth = 20;
    const itemsPerPage = 20;
    let currentY = 40;
    const nombre = this.nombreAuthor;
    const fecha = this.fechaNow;
    //Agregar logo en la parte superior derecha
    const addLogo = () => {
      // const logoUrl=  '../../assets/img/marca4.jpg';
      const marginRight = 10;
      const xPos = pageWidth - logoWidth - marginRight;
      // pdf.addImage(logoUrl, 'JPG', xPos, 10, logoWidth,20);

    }

    //Agregar Cabezera

    const addTableHeader = () => {
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text('Reporte de Datos', 10, 35);

      //Agregar nombre y fecha debajo del titulo
      pdf.setFontSize(10);
      pdf.setFont('Helvetica', 'normal');
      pdf.text(`Nombre: ${nombre}`, 10, 40);
      pdf.text(`fecha: ${fecha}`, 10, 45);

      pdf.setDrawColor(0);
      pdf.setFillColor(200, 200, 200);

      currentY = 55;

      pdf.rect(10, currentY, 10, 10, 'FD');
      pdf.rect(20, currentY, pageWidth - 30, 10, 'FD');

      pdf.setTextColor(0);
      pdf.text('#', 13, currentY + 7);
      pdf.text('Item', 23, currentY + 7);

      currentY += 10;

    };


    // Agregar filas con bordes

    const addTableRow = (index: number, item: string) => {

      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(10);

      //Dibujar las Celdas
      pdf.rect(10, currentY, 10, 10);
      pdf.rect(20, currentY, pageWidth - 30, 10);

      // texto en las celdas
      pdf.setTextColor(0);
      pdf.text(`${index + 1} `, 13, currentY + 7);
      pdf.text(item, 23, currentY + 7);

      currentY += 10;

    };

    // Agregar numero de pagina en el pie de pagina

    const addPageNumbers = () => {
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {

        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(`Pagina ${i} de ${pageCount}`, pageWidth - 50, pageHeight - 10);
      }

    };

    // Generar el reporte paginado

    const generateReport = () => {

      addLogo();
      addTableHeader();

      this.data.forEach((item, index) => {

        if (index > 0 && index % itemsPerPage === 0) {

          pdf.addPage();
          currentY = 40;
          addLogo();
          addTableHeader();

        }

        addTableRow(index, item)

      });

      //Aggregar numeracion de paginas al final
      addPageNumbers();

      //Guardar PDF
      pdf.save('reporte_ejemplo.pdf');

    };

    //Cargar el logo y generar el reporte
    const logoImage = new Image();
    logoImage.onload = () => {

      generateReport();

    };
  }

}
