import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { iTurno } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { InformationService } from 'src/app/services/information.service';
import { ShiftsService } from 'src/app/services/shifts.service';
import { CloseShiftComponent } from './close-shift/close-shift.component';
import { NgxPrintModule, NgxPrintService, PrintOptions } from 'ngx-print';
import { LoaderComponent } from "../loader/loader.component";
import { NodataComponent } from '../nodata/nodata.component';





@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [importaciones, LoaderComponent, NodataComponent],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.scss',
})
export class ShiftsComponent {
  readonly dialog = inject(MatDialog);

  datalist: iTurno[] = [];
  totalMovimientoTurno : number = 0;
  dineroEsperadoEnCaja : number =0;
  turnoSeleccionado! : iTurno | undefined;
  loader1 : boolean=false;
  loader2: boolean = false;

  constructor(
    public turnoService: ShiftsService,
    private alertasService: AlertServiceService,
    public informationService: InformationService,
    private printService: NgxPrintService

  ) {
    this.getAll();
    this.getTurnoActual();
    if(turnoService.isOpen!=undefined){
      this.totalMovimientoTurno = turnoService.isOpen.baseInicial + turnoService.isOpen.resumen.vefec + turnoService.isOpen.resumen.vt + turnoService.isOpen.resumen.vtransf;
      this.turnoSeleccionado = turnoService.isOpen;
    }
    console.log(informationService.mySucursal)
  }
  getAll() {
    this.loaderTurnos();
    this.turnoService.getAll(this.informationService.idSucursal).subscribe((data: ServiceResponse) => {
      if (data.status) {
        console.log(data.data)
        this.loaderTurnos();
        this.datalist = data.data;
      }
    })
  }
  openShift(): void {
    this.dialog.open(CloseShiftComponent, {
      width: '500px',
    }).afterClosed().subscribe(result=>{
      this.getAll();
      this.getTurnoActual();
    })
  }

  openModalCloseShift() {
    const dialogRef = this.dialog.open(CloseShiftComponent, {width : '1600px'});
    dialogRef.afterClosed().subscribe(result => {
      this.getAll();
      this.getTurnoActual();
      this.turnoSeleccionado=undefined;
    });
  }
  getTurnoActual(){
    this.turnoService.getTurnoActual(this.informationService.idUsuario).subscribe((data: ServiceResponse)=>{
      if(data.statusCode==200){
        this.turnoService.isOpen =  data.data==null? undefined : data.data;
        this.totalMovimientoTurno = this.turnoService.isOpen!.baseInicial + this.turnoService.isOpen!.resumen.vefec + this.turnoService.isOpen!.resumen.vt + this.turnoService.isOpen!.resumen.vtransf;
        this.dineroEsperadoEnCaja = this.turnoService.isOpen!.baseInicial + this.turnoService.isOpen!.resumen!.vefec;
        this.turnoSeleccionado =  this.turnoService.isOpen;
      }
    })
  }
  getTurnoById(id : number){
    this.turnoService.getById(id).subscribe((data : ServiceResponse)=>{
      if(data.status){
        this.turnoSeleccionado = data.data;
        this.totalMovimientoTurno = this.turnoSeleccionado!.baseInicial + this.turnoSeleccionado!.resumen.vefec + this.turnoSeleccionado!.resumen.vt + this.turnoSeleccionado!.resumen.vtransf;
        this.dineroEsperadoEnCaja = this.turnoSeleccionado!.baseInicial + this.turnoSeleccionado!.resumen!.vefec;
      }

    })
  }

  imprimirReporte() {
    const contenido = document.getElementById('reporte')?.innerHTML;
    if (contenido) {
      const ventana = window.open('', '', 'height=800,width=600');
      ventana?.document.write('<html><head><title>Reporte</title>');
      ventana?.document.write('</head><body>');
      ventana?.document.write(contenido);
      ventana?.document.write('</body></html>');
      ventana?.document.close();
      ventana?.print();
    }
  }

  printMe() {
    const customPrintOptions: PrintOptions = new PrintOptions({
      printSectionId: 'reporte',
      useExistingCss: true,
      printTitle: 'Detalles Solicitud',
      bodyClass: 'printable',
      openNewTab: true,
      previewOnly: false,
      closeWindow : true
    });
    this.printService.print(customPrintOptions);
  }

  loaderTurnos(){
    this.loader1 = this.loader1==true? false: true;
  }
  loaderTurno(){
    this.loader2 = this.loader2==true? false: true;
  }
  
}

