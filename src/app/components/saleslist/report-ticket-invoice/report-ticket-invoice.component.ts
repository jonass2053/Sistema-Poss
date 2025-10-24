import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxPrintService, PrintOptions } from 'ngx-print';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { iFactura } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { FacturaService } from 'src/app/services/factura.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AlertCircle } from 'angular-feather/icons';

interface InvoiceItem {
  name: string
  quantity: number
  unitPrice: number
  total: number
  isDiscount?: boolean
}

interface Customer {
  name: string
  id: string
  phone: string
  address: string
}

interface Invoice {
  number: string
  date: string
  cashier: string
  register: string
  customer: Customer
  items: InvoiceItem[]
  subtotal: number
  discounts: number
  taxableBase: number
  tax: number
  total: number
  payment: {
    cash: number
    change: number
  }
}
declare var printJS: any

@Component({
  selector: 'app-report-ticket-invoice',
  standalone: true,
  imports: [importaciones],
  templateUrl: './report-ticket-invoice.component.html',
  styleUrl: './report-ticket-invoice.component.scss',

})
export class ReportTicketInvoiceComponent implements OnInit {

  constructor(private printService: NgxPrintService, private facturaService: FacturaService, private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.idFactura = this.route.snapshot.paramMap.get('id');
    console.log(this.factura)
  }
  idFactura: number | any;
  @Input() factura!: iFactura;
 public formatCurrency(amount: number): string {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }


printDiv(divId: string) {
  const printContents = document.getElementById(divId)?.innerHTML;
  const originalContents = document.body.innerHTML;
  if (printContents) {
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    // window.location.reload(); // recarga la app para restaurar el estado de Angular
  }
}
  printMe() {
     const customPrintOptions: PrintOptions = new PrintOptions({
      printSectionId: 'print-section',
      useExistingCss: true,
      printTitle: 'Detalles Solicitud',
      bodyClass: 'printable',
      openNewTab: true,
    });
    this.printService.print(customPrintOptions);
    // const receipt = document.getElementById('thermal-receipt');
    // if (!receipt) return;

    // html2canvas(receipt, { scale: 3 }).then(canvas => {
    //   const imgData = canvas.toDataURL('image/png');
    //   const pdf = new jsPDF({
    //     orientation: 'portrait',
    //     unit: 'px',
    //     format: [canvas.width, canvas.height]
    //   });

    //   pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    //   // pdf.save('recibo.pdf');
    //   const pdfBlob = pdf.output('blob');
    //   const pdfUrl = URL.createObjectURL(pdfBlob);
    //   const printWindow = window.open(pdfUrl, '_blank');
    //   if (printWindow) {
    //     // Algunos navegadores necesitan tiempo para cargar el PDF antes de imprimir
    //     printWindow.onload = () => {
    //       printWindow.focus();
    //     };

    //   }
    // });

  }
    printMeOther() {
     const customPrintOptions: PrintOptions = new PrintOptions({
      printSectionId: 'aa',
      useExistingCss: true,
      printTitle: 'Detalles Solicitud',
      bodyClass: 'printable',
      openNewTab: true,
      previewOnly: false
    });
    this.printService.print(customPrintOptions);
  }

  // getById(){
  //   this.facturaService.getById(Factura.idFactura!).subscribe((data: any) => {
  //       console.log(data)
  //       this.facturaService.facturaEdit = data.data;
  //       this.router.navigateByUrl(`sales/newsale/${Factura.idFactura}`);
  //     })
  // }
}

