import { Injectable } from '@angular/core';
import { iCajaReporteConsolidado, iDetalleFactura, iFactura, iMovimientoProductos, iPago } from '../interfaces/iTermino';
import { Facebook } from 'angular-feather/icons';
import { ServiceResponse } from '../interfaces/service-response-login';

@Injectable({
    providedIn: 'root'
})
export class PrintServiceService {

    constructor() { }


    formatNumber(value: number): string {
        return new Intl.NumberFormat('es-DO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

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
                <span class="bold">${factura.detalle.filter((c: iDetalleFactura) => c.cantidad > 0).reduce((sum: number, p: iDetalleFactura) => sum + p.cantidad, 0)}</span>
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

    printReportVentas(facturas: iFactura[] | any, totalFacturado: number, totalPagado: number, totalPorPagar: number, totalVencido: number, fecha: string) {
        let items = '';
        let facturasCobradas = 0;
        facturas.forEach((factura: iFactura) => {
            if (factura.estadoFactura?.nombre == "Cobrada") {
                facturasCobradas++;
            }

            items += `
             <tr>
                        <td class="invoice-number">${factura.numeracion}</td>
                        <td class="client-name">${factura.contacto.nombreRazonSocial}</td>
                        <td><span class="document-type">${factura.numeracionObj.nombre}</span></td>
                        <td class="date">${factura.fechaCreacion}</td>
                        <td class="date">${factura.vencimiento}</td>
                        <td class="amount">${factura.totalGeneral}</td>
                        <td class="amount">${ factura.montoPagado}</td>
                        <td class="amount">${this.formatNumber(factura.montoPorPagar)}</td>
                        <td><span class="status cobrada">${factura?.estadoFactura?.nombre || "N/A"}</span></td>
            </tr>
            `;
        });
        const printWindow = window.open('', 'width=600,height=800');
        const content = `
        <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Facturas</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: white;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
        }

        .header h1 {
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 5px;
        }

        .header p {
            color: #6b7280;
            font-size: 14px;
        }

        .report-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 11px;
            color: #6b7280;
        }

        .table-container {
            overflow-x: auto;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }

        thead {
            background: #f9fafb;
        }

        th {
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        td {
            padding: 12px 8px;
            border-bottom: 1px solid #f3f4f6;
            font-size: 12px;
        }

        tbody tr:hover {
            background: #f9fafb;
        }

        tbody tr:last-child td {
            border-bottom: none;
        }

        .invoice-number {
            font-weight: 600;
            color: #1f2937;
        }

        .client-name {
            color: #4b5563;
        }

        .document-type {
            background: #eff6ff;
            color: #1d4ed8;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 500;
            display: inline-block;
        }

        .date {
            color: #6b7280;
            font-size: 11px;
        }

        .amount {
            font-weight: 600;
            text-align: right;
            color: #1f2937;
        }

        .status {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: center;
            display: inline-block;
            min-width: 80px;
        }

        .status.cobrada {
            background: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
        }

        .status.por-pagar {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fecaca;
        }

        .summary {
            margin-top: 30px;
             margin-buttom: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }

        .summary-card {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }

        .summary-card h3 {
            font-size: 14px;
            color: #374151;
            margin-bottom: 10px;
        }

        .summary-card .value {
            font-size: 20px;
            font-weight: 700;
            color: #1f2937;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            color: #6b7280;
            font-size: 10px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }

        /* Estilos para impresión */
        @media print {
            body {
                font-size: 10px;
            }
            
            .container {
                padding: 10px;
                max-width: none;
            }
            
            .header h1 {
                font-size: 18px;
            }
            
            .table-container {
                box-shadow: none;
                border: 1px solid #000;
            }
            
            th, td {
                padding: 8px 6px;
            }
            
            .status {
                border: 1px solid #000 !important;
            }
            
            .status.cobrada {
                background: #e5e5e5 !important;
                color: #000 !important;
            }
            
            .status.por-pagar {
                background: #d5d5d5 !important;
                color: #000 !important;
            }
            
            .summary {
                page-break-inside: avoid;
            }
            
            tbody tr {
                page-break-inside: avoid;
            }
        }

        @page {
            margin: 1cm;
            size: A4 landscape;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reporte de Facturas</h1>
            <p>Estado de cuentas y pagos</p>
        </div>

        <div class="report-info">
            <div>
                <strong>Fecha de generación:</strong> <span id="current-date">${fecha}</span>
            </div>
            <div>
                <strong>Total de registros:</strong> ${facturas.length}
            </div>
        </div>
<div class="summary">
            <div class="summary-card">
                <h3>Total Facturado</h3>
                <div class="value">${totalFacturado}</div>
            </div>
            <div class="summary-card">
                <h3>Total Cobrado</h3>
                <div class="value">${totalPagado}</div>
            </div>
            <div class="summary-card">
                <h3>Pendiente por Cobrar</h3>
                <div class="value">$${totalPorPagar}</div>
            </div>
            <div class="summary-card">
                <h3>Facturas Cobradas</h3>
                <div class="value">${facturasCobradas} de ${facturas.length}</div>
            </div>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Cliente</th>
                        <th>Tipo</th>
                        <th>F. Creación</th>
                        <th>F. Vencimiento</th>
                        <th>Total</th>
                        <th>M. pagado</th>
                        <th>M. por pagar</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${items}
                </tbody>
            </table>
        </div>

        

        <div class="footer">
            <p>Reporte generado automáticamente • Para uso interno únicamente</p>
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

    printReciboPago(pago: iPago, moneda: string) {
        let items = '';
        console.log(pago)
        const printWindow = window.open('', 'width=600,height=800');
        const content = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recibo de Pago</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
            padding: 15px;
            line-height: 1.3;
            font-size: 12px;
        }

        .receipt-container {
            max-width: 350px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        /* Header */
        .receipt-header {
            background: #4CAF50;
            color: white;
            padding: 12px;
            text-align: center;
        }

        .receipt-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 3px;
        }

        .receipt-subtitle {
            font-size: 10px;
            opacity: 0.9;
        }

        /* Body */
        .receipt-body {
            padding: 15px;
        }

        /* Status */
        .payment-status {
            text-align: center;
            margin-bottom: 15px;
        }

        .status-icon {
            width: 35px;
            height: 35px;
            background: #4CAF50;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 6px;
            font-size: 18px;
            color: white;
        }

        .status-text {
            font-size: 11px;
            color: #4CAF50;
            font-weight: 600;
        }

        /* Receipt Number */
        .receipt-number {
            text-align: center;
            background: #f8f9fa;
            border: 1px dashed #ccc;
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 12px;
        }

        .number-label {
            color: #666;
            font-size: 9px;
            margin-bottom: 2px;
        }

        .number-value {
            color: #333;
            font-size: 12px;
            font-weight: bold;
            font-family: 'Courier New', monospace;
        }

        /* Payment Details */
        .payment-details {
            margin-bottom: 12px;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 0;
            border-bottom: 1px dotted #ddd;
            font-size: 10px;
        }

        .detail-row:last-child {
            border-bottom: none;
            font-weight: bold;
            font-size: 14px;
            color: #333;
            padding-top: 8px;
            margin-top: 6px;
            border-top: 1px solid #4CAF50;
        }

        .detail-label {
            color: #666;
            font-weight: 500;
        }

        .detail-value {
            color: #333;
            font-weight: 600;
        }

        .amount {
            color: #4CAF50;
            font-size: 16px;
            font-weight: bold;
        }

        /* Info Sections */
        .info-section {
            background: #f8f9fa;
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 8px;
            font-size: 9px;
        }

        .info-title {
            font-weight: 600;
            margin-bottom: 4px;
            color: #495057;
            font-size: 10px;
        }

        .info-content {
            color: #6c757d;
            line-height: 1.3;
        }

        /* Footer */
        .receipt-footer {
            background: #f8f9fa;
            padding: 8px;
            text-align: center;
            border-top: 1px solid #eee;
            font-size: 8px;
            color: #666;
        }

        /* Print Controls */
        .print-controls {
            position: fixed;
            top: 15px;
            right: 15px;
            display: flex;
            gap: 6px;
            z-index: 1000;
        }

        .print-button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 6px 10px;
            border-radius: 15px;
            cursor: pointer;
            font-size: 10px;
            font-weight: 600;
            box-shadow: 0 2px 6px rgba(76, 175, 80, 0.3);
            transition: all 0.3s ease;
        }

        .print-button:hover {
            background: #45a049;
            transform: translateY(-1px);
        }

        .print-button.thermal {
            background: #2196F3;
        }

        .print-button.thermal:hover {
            background: #1976D2;
        }

        /* ESTILOS PARA IMPRESIÓN TÉRMICA (80mm) */
        @media print and (max-width: 80mm) {
            body {
                background: white;
                padding: 0;
                font-size: 8px;
                line-height: 1.1;
            }

            .receipt-container {
                max-width: 80mm;
                width: 80mm;
                box-shadow: none;
                border-radius: 0;
                margin: 0;
            }

            .receipt-header {
                padding: 6px;
                background: white !important;
                color: black !important;
                border-bottom: 1px solid #000;
            }

            .receipt-title {
                font-size: 12px;
                margin-bottom: 2px;
                color: black;
            }

            .receipt-subtitle {
                font-size: 8px;
                color: black;
            }

            .receipt-body {
                padding: 4px;
            }

            .payment-status {
                margin-bottom: 6px;
            }

            .status-icon {
                width: 20px;
                height: 20px;
                font-size: 12px;
                background: white !important;
                border: 1px solid #000;
                color: black !important;
                margin-bottom: 3px;
            }

            .status-text {
                font-size: 8px;
                color: black;
                font-weight: bold;
            }

            .receipt-number {
                background: white;
                border: 1px solid #000;
                padding: 4px;
                margin-bottom: 6px;
            }

            .number-label {
                font-size: 7px;
                color: black;
            }

            .number-value {
                font-size: 9px;
                color: black;
            }

            .detail-row {
                padding: 2px 0;
                font-size: 7px;
                border-bottom: 1px dotted #000;
            }

            .detail-row:last-child {
                font-size: 9px;
                padding-top: 4px;
                margin-top: 4px;
                border-top: 1px solid #000;
            }

            .detail-label, .detail-value {
                color: black;
                font-size: 7px;
            }

            .amount {
                font-size: 10px;
                color: black;
                font-weight: bold;
            }

            .info-section {
                background: white;
                border: 1px solid #000;
                padding: 3px;
                margin-bottom: 4px;
                font-size: 6px;
            }

            .info-title {
                font-size: 7px;
                color: black;
                margin-bottom: 2px;
            }

            .info-content {
                font-size: 6px;
                color: black;
                line-height: 1.1;
            }

            .receipt-footer {
                background: white;
                padding: 4px;
                font-size: 6px;
                color: black;
                border-top: 1px solid #000;
            }

            .print-controls {
                display: none;
            }

            .receipt-container::after {
                content: '- - - - - - - - - - - - - - - - - -';
                display: block;
                text-align: center;
                margin: 6px 0;
                font-size: 8px;
                color: #000;
            }
        }

        /* ESTILOS PARA PAPEL CARTA (8.5 x 11") */
        @media print and (min-width: 8.5in) {
            body {
                background: white;
                padding: 0.3in;
                font-size: 10px;
            }

            .receipt-container {
                max-width: 4in;
                width: 4in;
                box-shadow: none;
                border-radius: 0;
                border: 1px solid #000;
                margin: 0 auto;
            }

            .receipt-header {
                padding: 15px;
                background: white !important;
                color: black !important;
                border-bottom: 2px solid #000;
            }

            .receipt-title {
                font-size: 18px;
                color: black;
                margin-bottom: 4px;
            }

            .receipt-subtitle {
                font-size: 12px;
                color: black;
            }

            .receipt-body {
                padding: 15px;
            }

            .payment-status {
                margin-bottom: 15px;
            }

            .status-icon {
                width: 40px;
                height: 40px;
                font-size: 20px;
                background: white !important;
                border: 2px solid #000;
                color: black !important;
                margin-bottom: 8px;
            }

            .status-text {
                font-size: 12px;
                color: black;
                font-weight: bold;
            }

            .receipt-number {
                background: #f0f0f0;
                border: 1px solid #000;
                padding: 10px;
                margin-bottom: 15px;
            }

            .number-label {
                font-size: 10px;
                color: black;
            }

            .number-value {
                font-size: 14px;
                color: black;
            }

            .detail-row {
                padding: 6px 0;
                font-size: 10px;
                border-bottom: 1px solid #000;
            }

            .detail-row:last-child {
                font-size: 14px;
                padding-top: 8px;
                margin-top: 8px;
                border-top: 2px solid #000;
            }

            .detail-label, .detail-value {
                color: black;
                font-size: 10px;
            }

            .amount {
                font-size: 16px;
                color: black;
                font-weight: bold;
            }

            .info-section {
                background: #f8f8f8;
                border: 1px solid #000;
                padding: 10px;
                margin-bottom: 10px;
                font-size: 9px;
            }

            .info-title {
                font-size: 10px;
                color: black;
                margin-bottom: 5px;
            }

            .info-content {
                font-size: 9px;
                color: black;
                line-height: 1.3;
            }

            .receipt-footer {
                background: #f8f8f8;
                padding: 10px;
                font-size: 8px;
                color: black;
                border-top: 1px solid #000;
            }

            .print-controls {
                display: none;
            }
        }

        /* Ocultar controles en impresión */
        @media print {
            .print-controls {
                display: none !important;
            }
        }

        /* Responsive para pantalla */
        @media (max-width: 480px) {
            body {
                padding: 8px;
            }
            
            .receipt-container {
                max-width: 100%;
            }
            
            .receipt-header {
                padding: 10px;
            }
            
            .receipt-body {
                padding: 12px;
            }
            
            .print-controls {
                position: static;
                justify-content: center;
                margin-bottom: 15px;
            }
        }
    </style>
</head>
<body>
   
    
    <div class="receipt-container">
        <!-- Header -->
        <header class="receipt-header">
            <h1 class="receipt-title">RECIBO DE PAGO</h1>
            <p class="receipt-subtitle">Comprobante de pago</p>
        </header>

        <!-- Body -->
        <main class="receipt-body">
            <!-- Status -->
            <div class="payment-status">
                <div class="status-icon">✓</div>
                <div class="status-text">PAGO RECIBIDO</div>
            </div>

            <!-- Receipt Number -->
            <div class="receipt-number">
                <div class="number-label">No. RECIBO</div>
                <div class="number-value">REC-${pago.idPago}</div>
            </div>

            <!-- Payment Details -->
            <div class="payment-details">
                <div class="detail-row">
                    <span class="detail-label">FECHA Y HORA:</span>
                    <span class="detail-value">${pago.fecha}</span>
                </div>

                <div class="detail-row">
                    <span class="detail-label">CONCEPTO:</span>
                    <span class="detail-value">${pago.notaPago}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">REF:</span>
                    <span class="detail-value">${pago.facturaObj.numeracion}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">MONTO:</span>
                    <span class="detail-value amount">${moneda} ${pago.monto.toFixed(2)}</span>
                </div>
            </div>

            <!-- Recipient Info -->
            <div class="info-section">
                <div class="info-title">RECIBIDO POR:</div>
                <div class="info-content">
                    <strong> ${pago.usuarioObj.nombre.toUpperCase()} ${pago.usuarioObj.apellidos.toUpperCase()}</strong><br>
                </div>
            </div>

            <!-- Payment Method -->
            <div class="info-section">
                <div class="info-title">PAGO VIA:</div>
                <div class="info-content">
                    <strong>${pago.metodoPagoObj.nombre.toUpperCase()}</strong><br>
                </div>
            </div>

            <!-- Payer Info -->
            <div class="info-section">
                <div class="info-title">PAGADO POR:</div>
                <div class="info-content">
                    <strong>${pago.contactoObj.nombreRazonSocial.toUpperCase()}</strong><br>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="receipt-footer">
            <p>CONSERVE ESTE COMPROBANTE</p>
            <p>DUDAS: admin@sanpedro.com</p>
        </footer>
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

    printReportKardex(data: ServiceResponse) {
        let items = '';
        let facturasCobradas = 0;
        data.data.forEach((movimiento: iMovimientoProductos) => {
            items += `
             <tr>
                        <td class="invoice-number">${movimiento.fecha}</td>
                        <td class="client-name">${movimiento.productoObj.nombre}</td>
                        <td><span class="document-type">${movimiento.referencia}</span></td>
                        <td class="date">${movimiento.isEntrada == true ? 'Entrada' : 'Salida'}</td>
                        <td class="date">${movimiento.cantidad}</td>
                        <td class="amount">${movimiento.balance}</td>
                        <td class="amount">${this.formatNumber(movimiento.productoObj.costoInicial)}</td>
                        <td class="amount">${this.formatNumber(movimiento.productoObj.costoInicial * movimiento.cantidad)}</td>
                        
            </tr>
            `;
        });
        const printWindow = window.open('', 'width=600,height=800');
        const content = `
        <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Facturas</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: white;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
        }

        .header h1 {
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 5px;
        }

        .header p {
            color: #6b7280;
            font-size: 14px;
        }

        .report-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 11px;
            color: #6b7280;
        }

        .table-container {
            overflow-x: auto;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }

        thead {
            background: #f9fafb;
        }

        th {
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        td {
            padding: 12px 8px;
            border-bottom: 1px solid #f3f4f6;
            font-size: 12px;
        }

        tbody tr:hover {
            background: #f9fafb;
        }

        tbody tr:last-child td {
            border-bottom: none;
        }

        .invoice-number {
            font-weight: 600;
            color: #1f2937;
        }

        .client-name {
            color: #4b5563;
        }

        .document-type {
            background: #eff6ff;
            color: #1d4ed8;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 500;
            display: inline-block;
        }

        .date {
            color: #6b7280;
            font-size: 11px;
        }

        .amount {
            font-weight: 600;
            text-align: right;
            color: #1f2937;
        }

        .status {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: center;
            display: inline-block;
            min-width: 80px;
        }

        .status.cobrada {
            background: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
        }

        .status.por-pagar {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fecaca;
        }

        .summary {
            margin-top: 30px;
             margin-buttom: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }

        .summary-card {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }

        .summary-card h3 {
            font-size: 14px;
            color: #374151;
            margin-bottom: 10px;
        }

        .summary-card .value {
            font-size: 20px;
            font-weight: 700;
            color: #1f2937;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            color: #6b7280;
            font-size: 10px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }

        /* Estilos para impresión */
        @media print {
            body {
                font-size: 10px;
            }
            
            .container {
                padding: 10px;
                max-width: none;
            }
            
            .header h1 {
                font-size: 18px;
            }
            
            .table-container {
                box-shadow: none;
                border: 1px solid #000;
            }
            
            th, td {
                padding: 8px 6px;
            }
            
            .status {
                border: 1px solid #000 !important;
            }
            
            .status.cobrada {
                background: #e5e5e5 !important;
                color: #000 !important;
            }
            
            .status.por-pagar {
                background: #d5d5d5 !important;
                color: #000 !important;
            }
            
            .summary {
                page-break-inside: avoid;
            }
            
            tbody tr {
                page-break-inside: avoid;
            }
        }

        @page {
            margin: 1cm;
            size: A4 landscape;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reporte del almacen</h1>
            <p>Kardex / Movimiento de los productos</p>
        </div>

        <div class="report-info">
            <div>
                <strong>Fecha de generación:</strong> <span id="current-date">${data.dateNow}</span>
            </div>
            <div>
                <strong>Total de registros:</strong> ${data.data.length}
            </div>
        </div>
<div class="summary">
            <div class="summary-card">
                <h3>Total entradas</h3>
                <div class="value">${data.cantEntradas}</div>
            </div>
            <div class="summary-card">
                <h3>Total salidas</h3>
                <div class="value">${data.cantSalidas}</div>
            </div>
            <div class="summary-card">
                <h3>Monto Total del Inventario</h3>
                <div class="value">$${this.formatNumber(data.montoTotalInventario)}</div>
            </div>
            <div class="summary-card">
                <h3>Cantidad de productos</h3>
                <div class="value">${data.cantProd}</div>
            </div>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        
                        <th>Fecha</th>
                        <th>Producto</th>
                        <th>Referencia</th>
                        <th>Movimiento</th>
                        <th>Cantidad</th>
                        <th>Balance</th>
                        <th>Costo unitario</th>
                        <th>Coasto total</th>
                    </tr>
                </thead>
                <tbody>
                    ${items}
                </tbody>
            </table>
        </div>

        

        <div class="footer">
            <p>Reporte generado automáticamente • Para uso interno únicamente</p>
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






    //Reporte Consolidado de caja
    consolidadoTotal!: iCajaReporteConsolidado;
    printReportConsolidadoCajas(desde: any, hasta: any, fecha: any, reportData: iCajaReporteConsolidado[],) {
        let items = '';
        let facturasCobradas = 0;
        let totalInicial = 0;
        let totalEfectivo = 0;
        let totalTarjetas = 0;
        let totalTrasferencias = 0;
        let totalEntradas = 0;
        let totalSalidas = 0;
        let totalGeneral = 0;
        let totalFaltante = 0;
        // fecha = `${fecha?.getFullYear()}-${(fecha?.getMonth()!) + 1}-${fecha?.getDate()}`;

        reportData.forEach((t: iCajaReporteConsolidado) => {
            totalInicial += t.totalInicial;
            totalEfectivo += t.totalEfectivo;
            totalTarjetas += t.totalTarjetas;
            totalTrasferencias += t.totalTrasferencias;
            totalEntradas += t.totalEntradas;
            totalSalidas += t.totalSalidas;
            totalGeneral += t.totalGeneral;
            totalFaltante += t.totalFaltante;

            items += `
             <tr>
                        <td class="invoice-number">${t.cajaNombre}</td>
                        <td class="invoice-number">${t.totalInicial.toFixed(2)}</td>
                        <td class="client-name">${t.totalEfectivo.toFixed(2)}</td>
                        <td><span class="document-type">${t.totalTarjetas.toFixed(2)}</span></td>
                        <td class="date">${t.totalTrasferencias.toFixed(2)}</td>
                        <td class="date">${t.totalEntradas.toFixed(2)}</td>
                        <td class="amount">${t.totalSalidas.toFixed(2)}</td>
                        <td class="amount">${t.totalFaltante.toFixed(2)}</td>
                        <td class="amount">${t.totalGeneral.toFixed(2)}</td>
            </tr>
            `;
        });
        const printWindow = window.open('', 'width=600,height=800');
        const content = `
        <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Facturas</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: white;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
        }

        .header h1 {
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 5px;
        }

        .header p {
            color: #6b7280;
            font-size: 14px;
        }

        .report-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 11px;
            color: #6b7280;
        }

        .table-container {
            overflow-x: auto;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }

        thead {
            background: #f9fafb;
        }

        th {
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        td {
            padding: 12px 8px;
            border-bottom: 1px solid #f3f4f6;
            font-size: 12px;
        }

        tbody tr:hover {
            background: #f9fafb;
        }

        tbody tr:last-child td {
            border-bottom: none;
        }

        .invoice-number {
            font-weight: 600;
            color: #1f2937;
        }

        .client-name {
            color: #4b5563;
        }

        .document-type {
            background: #eff6ff;
            color: #1d4ed8;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 500;
            display: inline-block;
        }

        .date {
            color: #6b7280;
            font-size: 11px;
        }

        .amount {
            font-weight: 600;
            text-align: right;
            color: #1f2937;
        }

        .status {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: center;
            display: inline-block;
            min-width: 80px;
        }

        .status.cobrada {
            background: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
        }

        .status.por-pagar {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fecaca;
        }

        .summary {
            margin-top: 30px;
             margin-buttom: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }

        .summary-card {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }

        .summary-card h3 {
            font-size: 14px;
            color: #374151;
            margin-bottom: 10px;
        }

        .summary-card .value {
            font-size: 20px;
            font-weight: 700;
            color: #1f2937;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            color: #6b7280;
            font-size: 10px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }

        /* Estilos para impresión */
        @media print {
            body {
                font-size: 10px;
            }
            
            .container {
                padding: 10px;
                max-width: none;
            }
            
            .header h1 {
                font-size: 18px;
            }
            
            .table-container {
                box-shadow: none;
                border: 1px solid #000;
            }
            
            th, td {
                padding: 8px 6px;
            }
            
            .status {
                border: 1px solid #000 !important;
            }
            
            .status.cobrada {
                background: #e5e5e5 !important;
                color: #000 !important;
            }
            
            .status.por-pagar {
                background: #d5d5d5 !important;
                color: #000 !important;
            }
            
            .summary {
                page-break-inside: avoid;
            }
            
            tbody tr {
                page-break-inside: avoid;
            }
        }

        @page {
            margin: 1cm;
            size: A4 landscape;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reporte consolidado de caja</h1>
            <p>Desde: ${desde}</p>
            <p>Hasta: ${hasta}</p>

        </div>

        <div class="report-info">
            <div>
                <strong>Fecha de generación:</strong> <span id="current-date">${fecha}</span>
            </div>
            <div>
                <strong>Total de registros:</strong> ${reportData.length}
            </div>
        </div>
<div class="summary">
            <div class="summary-card">
                <h3>Total Inicial</h3>
                <div class="value">${totalInicial.toFixed(2)}</div>
            </div>
            <div class="summary-card">
                <h3>Total de ventas en efectivo</h3>
                <div class="value">${totalEfectivo.toFixed(2)}</div>
            </div>
            <div class="summary-card">
                <h3>Total de ventas en tarjeta</h3>
                <div class="value">$${totalTarjetas.toFixed(2)}</div>
            </div>
            <div class="summary-card">
                <h3>Total de vnetas en trasferencia</h3>
                <div class="value">${totalTrasferencias.toFixed(2)}</div>
            </div>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Nombre Caja</th>
                        <th>Total Inicial</th>
                        <th>Total V.Efectivo</th>
                        <th>Total V.Tarjetas</th>
                        <th>Total V.Trasferencias</th>
                        <th>Total Entradas</th>
                        <th>Total Salidas</th>
                        <th>Total Faltante</th>
                        <th>Total General</th>
                    </tr>
                </thead>
                <tbody>
                    ${items}
                </tbody>
            </table>
        </div>

        

        <div class="footer">
            <p>Reporte generado automáticamente • Para uso interno únicamente</p>
        </div>
    </div>


      <script>
        window.onload = function () {
          setTimeout(() => {
            window.print();
          }, 500);
        };

        // window.onafterprint = function () {
        //   window.close();
        // };
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
