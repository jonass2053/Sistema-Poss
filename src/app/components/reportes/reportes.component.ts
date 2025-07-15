import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"

// Angular Material Imports
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatTableModule } from "@angular/material/table"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatChipsModule } from "@angular/material/chips"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { MatGridListModule } from "@angular/material/grid-list"
import { MatDividerModule } from "@angular/material/divider"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSnackBarModule, type MatSnackBar } from "@angular/material/snack-bar"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms"


interface SalesMetric {
  label: string
  value: number
  currency: string
  icon: string
  color: string
}

interface SalesDocument {
  tipo: string
  ncfNumero: string
  almacen: string
  centroCostos: string
  estado: string
  cliente: string
  identificacion: string
  creacion: Date
  subtotal: number
  descuento: number
  antesImpuestos: number
}
@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [ CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatToolbarModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent {
 filtersForm: FormGroup
  additionalFiltersForm: FormGroup
  isLoading = false

  // Datos del gráfico
  chartData = {
    labels: [
      "Jul",
      "04 Jul",
      "05 Jul",
      "07 Jul",
      "09 Jul",
      "11 Jul",
      "13 Jul",
      "15 Jul",
      "17 Jul",
      "19 Jul",
      "21 Jul",
      "23 Jul",
      "25 Jul",
      "27 Jul",
      "29 Jul",
    ],
    datasets: [
      {
        label: "2024",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
      },
      {
        label: "2025",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: "#2196F3",
        backgroundColor: "rgba(33, 150, 243, 0.1)",
      },
    ],
  }

  // Métricas de ventas
  salesMetrics: SalesMetric[] = [
    {
      label: "Subtotal",
      value: 0,
      currency: "RD$0",
      icon: "receipt",
      color: "primary",
    },
    {
      label: "Descuento",
      value: 0,
      currency: "RD$0",
      icon: "local_offer",
      color: "accent",
    },
    {
      label: "Ventas brutas",
      value: 0,
      currency: "RD$0",
      icon: "trending_up",
      color: "primary",
    },
    {
      label: "Notas crédito",
      value: 0,
      currency: "RD$0",
      icon: "credit_card",
      color: "warn",
    },
    {
      label: "Antes de impuestos",
      value: 0,
      currency: "RD$0",
      icon: "calculate",
      color: "primary",
    },
    {
      label: "Impuestos",
      value: 0,
      currency: "RD$0",
      icon: "account_balance",
      color: "accent",
    },
    {
      label: "Después de impuestos",
      value: 0,
      currency: "RD$0",
      icon: "paid",
      color: "primary",
    },
  ]

  // Lista de documentos
  documents: SalesDocument[] = []
  displayedColumns: string[] = [
    "tipo",
    "ncfNumero",
    "almacen",
    "centroCostos",
    "estado",
    "cliente",
    "identificacion",
    "creacion",
    "subtotal",
    "descuento",
    "antesImpuestos",
  ]

  // Opciones para selects
  warehouses = ["Todas", "Almacén Principal", "Almacén Norte", "Almacén Sur"]
  numberings = ["Todas", "B01", "B02", "B04"]
  documentTypes = ["Tipo de documento", "Factura", "Nota de Crédito", "Cotización"]
  states = ["Estado", "Completado", "Pendiente", "Cancelado"]

  constructor(
    private fb: FormBuilder,
    // private snackBar: MatSnackBar,
  ) {
    this.filtersForm = this.fb.group({
      startDate: [new Date()],
      endDate: [new Date()],
      warehouse: ["Todas"],
      numbering: ["Todas"],
    })

    this.additionalFiltersForm = this.fb.group({
      documentType: [""],
      ncfNumber: [""],
      state: [""],
      client: [""],
      creationDate: [null],
    })
  }

  ngOnInit() {
    this.loadInitialData()
  }

  loadInitialData() {
    this.isLoading = true
    // Simular carga de datos inicial
    setTimeout(() => {
      this.isLoading = false
      console.log("Datos iniciales cargados")
    }, 1000)
  }

  generateReport() {
    this.isLoading = true
    const filters = this.filtersForm.value

    console.log("Generando reporte con filtros:", filters)

    setTimeout(() => {
      this.isLoading = false
      // this.snackBar.open("Reporte generado correctamente", "Cerrar", {
      //   duration: 3000,
      //   horizontalPosition: "end",
      //   verticalPosition: "top",
      // })
    }, 2000)
  }

  filterResults() {
    this.isLoading = true
    const additionalFilters = this.additionalFiltersForm.value

    console.log("Filtrando resultados con:", additionalFilters)

    setTimeout(() => {
      this.isLoading = false
      // this.snackBar.open("Filtros aplicados correctamente", "Cerrar", {
      //   duration: 3000,
      //   horizontalPosition: "end",
      //   verticalPosition: "top",
      // })
    }, 1000)
  }

  exportReport() {
    // this.snackBar.open("Exportando reporte...", "Cerrar", {
    //   duration: 2000,
    // })
  }

  printReport() {
    window.print()
  }

  shareReport() {
    // this.snackBar.open("Funcionalidad de compartir disponible próximamente", "Cerrar", {
    //   duration: 3000,
    // })
  }

  clearFilters() {
    this.additionalFiltersForm.reset()
    // this.snackBar.open("Filtros limpiados", "Cerrar", {
    //   duration: 2000,
    // })
  }
}
