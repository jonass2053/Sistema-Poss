import { Component, Inject, Input, input, OnInit } from '@angular/core';
import { importaciones } from '../Core/utilities/material/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ProductoService } from '../services/producto.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceResponse } from '../interfaces/service-response-login';
import { LoaderComponent } from '../components/loader/loader.component';

@Component({
  selector: 'app-get-bar-code',
  standalone: true,
  imports: [
    importaciones,
    LoaderComponent
  ],
  templateUrl: './get-bar-code.component.html',
  styleUrl: './get-bar-code.component.scss'
})
export class GetBarCodeComponent {
  // @Input() idProducto: string = '';
  barcodeUrl!: any;

  constructor(private productoService: ProductoService, private sanitizer: DomSanitizer, @Inject(MAT_DIALOG_DATA) public data: any) 
  {
    this.getBarCode();
   }

   loading : boolean = false;

  getBarCode() {
    this.loading=true;
    this.productoService.generateBarCode(this.data.id).subscribe((data: ServiceResponse) => {
      // const objectURL = URL.createObjectURL(data.data.ImgBarCode);
      // this.barcodeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.barcodeUrl = data.data.imgBarCode;
      this.loading=false;
    });
  }

  printBarcode() {
  const printWindow = window.open('', 'width=600,height=800');
  const content = `
    <html>
      <head>
        <title>Imprimir Código de Barra</title>
        <style>
          body {
            margin: 0;
            padding: 10px;
            text-align: center;
          }
          img {
            max-width: 100%;
            height: auto;
          }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        <img src="${this.barcodeUrl}">
      </body>
    </html>
  `;
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
  }
}
}
