import { Injectable } from '@angular/core';
import { iDetalleFactura, iFactura } from '../interfaces/iTermino';
import { Facebook } from 'angular-feather/icons';

@Injectable({
    providedIn: 'root'
})
export class PrintServiceService {

    constructor() { }

    printTicketFactura(factura: iFactura | any) {
        let items = '';
        factura.detalle.forEach((detalle: iDetalleFactura) => {
            items += `
             <!-- Items de la Factura -->
        <div class="item">
            <div class="item-name">${detalle.nombre.toUpperCase()}</div>
            <div class="item-details">
                <span>${detalle.cantidad} x RD$ ${detalle.precio.toFixed(2)}</span>
                <span class="bold">RD$ ${detalle.total.toFixed(2)}</span>
            </div>
        </div>
            `;
        });
        const printWindow = window.open('', 'width=600,height=800');
        const content = `
    <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documento No. ${factura.numeracionObj.contador}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Courier New', monospace;
            background-color: #f5f5f5;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 100vh;
        }

        .thermal-receipt {
            width: 80mm;
            max-width: 302px; /* 80mm = ~302px */
            background: white;
            padding: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            font-size: 11px;
            line-height: 1.2;
            color: #000;
            border: 1px solid #ddd;
        }

        .header {
            text-align: center;
            margin-bottom: 8px;
            border-bottom: 1px dashed #000;
            padding-bottom: 8px;
        }

        .company-name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 2px;
            text-transform: uppercase;
        }

        .company-info {
            font-size: 9px;
            margin-bottom: 1px;
        }

        .rnc-info {
            font-size: 10px;
            font-weight: bold;
            margin: 3px 0;
        }

        .ncf-section {
            text-align: center;
            margin: 8px 0;
            padding: 4px 0;
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
        }

        .ncf-title {
            font-size: 10px;
            font-weight: bold;
            margin-bottom: 2px;
        }

        .ncf-number {
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 1px;
        }

        .invoice-info {
            margin: 8px 0;
            font-size: 9px;
        }

        .invoice-info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1px;
        }

        .customer-info {
            margin: 8px 0;
            padding: 4px 0;
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
            font-size: 9px;
        }

        .customer-row {
            display: flex;
            margin-bottom: 1px;
        }

        .customer-label {
            min-width: 45px;
            font-weight: bold;
        }

        .items-header {
            font-size: 9px;
            font-weight: bold;
            border-bottom: 1px solid #000;
            padding: 2px 0;
            margin: 8px 0 4px 0;
        }

        .items-header-row {
            display: flex;
            justify-content: space-between;
        }

        .item {
            margin-bottom: 3px;
            font-size: 9px;
        }

        .item-name {
            font-weight: bold;
            margin-bottom: 1px;
        }

        .item-details {
            display: flex;
            justify-content: space-between;
            font-size: 8px;
        }

        .totals {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px dashed #000;
            font-size: 10px;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
        }

        .total-row.final {
            font-weight: bold;
            font-size: 12px;
            border-top: 1px solid #000;
            padding-top: 3px;
            margin-top: 4px;
        }

        .payment-info {
            margin: 8px 0;
            padding: 4px 0;
            border-top: 1px dashed #000;
            font-size: 9px;
        }

        .footer {
            text-align: center;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px dashed #000;
            font-size: 8px;
        }

        .footer-message {
            margin: 2px 0;
        }

        .qr-placeholder {
            width: 60px;
            height: 60px;
            border: 1px solid #000;
            margin: 8px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            text-align: center;
        }

        .legal-text {
            font-size: 7px;
            text-align: center;
            margin: 4px 0;
            line-height: 1.1;
        }

        .cut-line {
            text-align: center;
            margin: 10px 0;
            font-size: 8px;
            letter-spacing: 2px;
        }

        /* Estilos para impresión */
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .thermal-receipt {
                box-shadow: none;
                border: none;
                width: 80mm;
                max-width: none;
            }
        }

        .right-align {
            text-align: right;
        }

        .center-align {
            text-align: center;
        }

        .bold {
            font-weight: bold;
        }

        .small-text {
            font-size: 8px;
        }

        .extra-small {
            font-size: 7px;
        }
    </style>
</head>
<body>
    <div class="thermal-receipt">
        <!-- Encabezado de la Empresa -->
        <div class="header">
            <div class="company-name">${factura.empresaObj.razonSocial.toUpperCase()}</div>
            <div class="company-info">${factura.sucursalObj.direccion}</div>
            <div class="company-info">Tel: ${factura.sucursalObj.telefono1 || ''}  • ${factura.sucursalObj.telefono2 || ''} </div> 
            <div class="rnc-info">RNC: ${factura.empresaObj.rnc}</div>
        </div>

        <!-- Información NCF -->
        <div class="ncf-section">
            <div class="ncf-title">${factura.numeracionObj.nombre.toUpperCase()}</div>
            <div class="ncf-number">${factura.numeracion}</div>
           <!-- <div class="small-text">Válida hasta: 31/12/2024</div> -->
        </div>

        <!-- Información de la Factura -->
        <div class="invoice-info">
            <div class="invoice-info-row">
                <span class="bold">${factura.numeracionObj.nombre.toUpperCase()} No:</span>
                <span>${factura.numeracionObj.contador}</span>
            </div>
            <div class="invoice-info-row">
                <span class="bold">Fecha:</span>
                <span>${factura.fechaCreacion}</span>
            </div>
            <!-- <div class="invoice-info-row">
                 <span class="bold">Hora:</span>
                 <span>${factura.fechaCreacion}</span>
             </div> -->
            <div class="invoice-info-row">
                <span class="bold">Cajero:</span>
                <span>${factura.usuario.nombre} ${factura.usuario.apellidos}</span>
            </div>
            <!-- <div class="invoice-info-row">
                 <span class="bold">Caja:</span>
                 <span>001</span>
             </div> -->
        </div>

        <!-- Información del Cliente -->
        <div class="customer-info">
            <div class="customer-row">
                <span class="customer-label bold">Cliente:</span>
                <span>${factura.contacto.nombreRazonSocial.toUpperCase()}</span>
            </div>
            <div class="customer-row">
                <span class="customer-label bold">RNC/Ced:</span>
                <span>${factura.contacto.rnc}</span>
            </div>
            <div class="customer-row">
                <span class="customer-label bold">Dirección:</span>
                <span>${factura.contacto.direccion}</span>
            </div>
        </div>

        <!-- Encabezado de Items -->
        <div class="items-header">
            <div class="items-header-row">
                <span>DESCRIPCION</span>
                <span>TOTAL</span>
            </div>
        </div>
       ${items}
        <!-- Totales -->
        <div class="totals">
            <div class="total-row">
                <span>CANTIDAD DE ARTICULOS:</span>
                <span class="bold">${factura.detalle.filter((c : iDetalleFactura)=>c.cantidad>0).reduce((sum : number, p: iDetalleFactura) => sum + p.cantidad, 0)}</span>
            </div>
            <div class="total-row">
                <span>SUBTOTAL:</span>
                <span>RD$ ${factura.subTotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>DESCUENTO:</span>
                <span>RD$ ${factura.descuento.toFixed(2)}</span>
            </div>
            <!-- <div class="total-row">
                 <span>SUBTOTAL GRAVADO:</span>
                 <span>RD$ 642.86</span>
             </div>
             <div class="total-row">
                 <span>SUBTOTAL EXENTO:</span>
                 <span>RD$ 0.00</span>
             </div> -->

            <div class="total-row">
                <span>ITBIS (18%):</span>
                <span>RD$ ${factura.itbis.toFixed(2)}</span>
            </div>
            <!-- <div class="total-row">
                 <span>PROPINA:</span>
                 <span>RD$ 0.00</span>
             </div> -->
            <div class="total-row final">
                <span>TOTAL A PAGAR:</span>
                <span>RD$ ${factura.totalGeneral.toFixed(2)}</span>
            </div>
        </div>

        <!-- Información de Pago -->
        <div class="payment-info">
            <div class="total-row bold">
                <span>FORMA DE PAGO:</span>
            </div>
            <div class="total-row">
                <span>${factura.terminoObj.nombre.toUpperCase()}</span>
                <span>RD$ ${factura.totalRecibido.toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>CAMBIO:</span>
                <span>RD$ ${factura.cambio.toFixed(2)}</span>
            </div>
        </div>

        <!-- Código QR Placeholder -->
        <!-- <div class="qr-placeholder">
             <div>CODIGO<br>QR<br>DGII</div>
         </div> -->

        <!-- Pie de Página -->
        <div class="footer">
            <div class="footer-message bold">¡GRACIAS POR SU COMPRA!</div>
            <div class="footer-message">Conserve este comprobante</div>
            <div class="footer-message">para cualquier reclamo</div>
        </div>

        <!-- Texto Legal -->
        <!-- <div class="legal-text">
             Esta factura es válida sin sello ni firma<br>
             de conformidad con la Ley 253-12 y<br>
             Norma General 06-2018 de la DGII
         </div> -->

        <!-- Información Adicional DGII -->
        <!-- <div class="legal-text">
             <div class="bold">REGIMEN TRIBUTARIO:</div>
             <div>Contribuyente del Régimen Ordinario</div>
             <div class="bold">AUTORIZACION DGII:</div>
             <div>No. 12345678901234567890</div>
         </div> -->

        <!-- Línea de Corte -->
        <div class="cut-line">
            ✂ - - - - - - - - - - - - - - - - - - - -
        </div>

        <!-- Información del Sistema -->
        <div class="footer">
            <div class="extra-small">Sistema POS v1.0</div>
            <div class="extra-small">TechSolutions</div>
            <div class="extra-small">Soporte: (809) 569-0981</div>
        </div>
    </div>

      <script>
        window.onload = function () {
          setTimeout(() => {
            window.print();
          }, 500);
        };

        window.onafterprint = function () {
          window.close();
        };
      </script>
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
