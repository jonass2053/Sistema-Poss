import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InformationService } from '../services/information.service';
import { FacturaService } from '../services/factura.service';
import { iResumen } from '../interfaces/iTermino';
import { ServiceResponse } from '../interfaces/service-response-login';
import { importaciones } from '../Core/utilities/material/material';
import { LoaderComponent } from '../components/loader/loader.component';
// import { ApexYAxis, ChartComponent } from 'ng-apexcharts';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexOptions
} from "ng-apexcharts";







import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  yaxis?: ApexYAxis | ApexYAxis[];   // 👈 aquí lo agregamos
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  @ViewChild("chart", { static: false }) chart!: ChartComponent;
  public chartOptions: any;

  constructor(
    private informationService: InformationService,
    private facturaService: FacturaService,
    private fb: FormBuilder,
    private router : Router
  ) {


    let hoy: Date = new Date();
    let haceDosMeses: Date = new Date(hoy);
    haceDosMeses.setMonth(hoy.getMonth() - 2);
    this.miFormulario.patchValue({
      desde: haceDosMeses.toISOString().split("T")[0], // YYYY-MM-DD
      hasta: hoy.toISOString().split("T")[0]
    });

    this.getResumen();
    if(informationService.idRol==24){
      informationService.isPos = true;
      localStorage.setItem("isPos", JSON.stringify(true));
      router.navigate(['/sales/newsale/0/1']);
    }

  }





  miFormulario: FormGroup = this.fb.group({
    desde: this.fb.control(""),
    hasta: this.fb.control("")
  })


  ventasPorMesMontos: number[] = [];
  displayedColumns: string[] = [
    'Cliente', 'Documento', 'Monto', 'Vencimiento', 'Estado',
  ];
  resumen!: iResumen;
  loading: boolean = true;
  dateNow: any;
  montoTotalVencidas: number = 0;
  cantTotalVencidas: number = 0;
  montoTotalActivas: number = 0;
  cantTotalActivas: number = 0;



  getResumen() {
    this.setFormatDate();
    this.loading = true;
    this.facturaService.getResumen(this.informationService.idSucursal, this.miFormulario.value.desde, this.miFormulario.value.hasta).subscribe((response: ServiceResponse) => {
      if (response.status) {
        this.resumen = response.data;
        this.dateNow = new Date(response.dateNow);
        this.loading = false;
        this.ventasPorMesMontos = [];
        this.generarGrafica();
        this.CalcularMontosCuentaPorCobrar();
      }
    })
  }

  CalcularMontosCuentaPorCobrar() {
    this.resumen.cuentaPorCobrar.forEach(i => {
      if (i.vencido == true) {
        this.montoTotalVencidas += i.monto;
        this.cantTotalVencidas++;
      } else {
        this.montoTotalActivas += i.monto;
        this.cantTotalActivas++;
      }
    })
  }

  ngOnInit(): void {
  }


  generarGrafica() {
    let maxMonto = 0;
    let montoTotal = 0;
    this.resumen.ventasPorMes.forEach(mes => {
      this.ventasPorMesMontos.push(mes.montoTotal);
      montoTotal += mes.montoTotal;
      if (mes.montoTotal > maxMonto) {
        maxMonto = mes.montoTotal;
      }
    });

    let montoFormateado = montoTotal.toLocaleString('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    this.chartOptions = {
      series: [
        {
          name: "Ventas por mes",
          data: this.ventasPorMesMontos
        }
      ],
      chart: {
        height: 325,
        type: "bar"
      },
      title: {
        text: `Resumen de ventas por mes del año ${this.dateNow.getFullYear()} : RD$${montoFormateado}`
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      },
      plotOptions: {
        bar: {
          columnWidth: '50%', // Ajusta el ancho de las barras, puede ser '50%', '70%', etc.
          distributed: false  // si quieres que cada barra tenga color distinto, poner true
        }
      },
      yaxis: {
        min: 0,
        forceNiceScale: false,  // 👈 importante
        max: maxMonto + 5000, // se ajusta al mayor valor
        tickAmount: 6,
        labels: {
          formatter: function (val: number) {
            return val.toLocaleString("es-DO", {
              style: "currency",
              currency: "DOP"
            });
          }
        }
      }
    }
  }


  setFormatDate() {
    let desdeOri: Date | null = this.miFormulario.value.desde ? new Date(this.miFormulario.value.desde) : null;
    let hastaOri: Date | null = this.miFormulario.value.hasta ? new Date(this.miFormulario.value.hasta) : null;
    if (desdeOri != undefined && hastaOri != undefined) {
      this.miFormulario.patchValue({
        desde: `${desdeOri?.getFullYear()}-${(desdeOri?.getMonth()!) + 1}-${desdeOri?.getDate()}`,
        hasta: `${hastaOri?.getFullYear()}-${(hastaOri?.getMonth()!) + 1}-${hastaOri?.getDate()}`
      })
    }
  }


  // resetFormatDate() {
  //   let desdeOri: Date | null = this.miFormulario.value.desde ? new Date(this.miFormulario.value.desde) : null;
  //   let hastaOri: Date | null = this.miFormulario.value.hasta ? new Date(this.miFormulario.value.hasta) : null;
  //   if (desdeOri != undefined && hastaOri != undefined) {
  //     this.miFormulario.patchValue({
  //       desde: `${(desdeOri?.getMonth()!) + 1}-${desdeOri?.getDate()}-${desdeOri?.getFullYear()}`,
  //       hasta: `${(hastaOri?.getMonth()!) + 1}-${hastaOri?.getDate()}-${hastaOri?.getFullYear()}`
  //     })

  //     console.log(this.miFormulario.value)
  //   }
  // }





  ngAfterViewInit() {
    //  this.createBarChart();
  }



}