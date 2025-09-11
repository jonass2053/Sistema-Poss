import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CashRegisterComponent } from '../cash-register/cash-register.component';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { BoxServiceService } from 'src/app/services/box-service.service';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { iCaja, iTurno } from 'src/app/interfaces/iTermino';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShiftListComponent } from './shift-list/shift-list.component';
import { ReporteConsolidadoComponent } from './reporte-consolidado/reporte-consolidado.component';
export interface CashRegister {
  id: number;
  cashier: string;
  openDate: string;
  openTime: string;
  closeTime: string | null;
  status: 'Abierta' | 'Cerrada';
  openAmount: number;
  closeAmount: number | null;
  totalSales: number;
  salesAmount: number;
  difference: number | null;
  shift: string;
}
@Component({
  selector: 'app-cash-register-list-component',
  standalone: true,
  imports: [importaciones],
  templateUrl: './cash-register-list-component.component.html',
  styleUrl: './cash-register-list-component.component.scss'
})
export class CashRegisterListComponentComponent implements OnInit {
  cashRegisters: CashRegister[] = [
    {
      id: 1,
      cashier: 'Juan Pérez',
      openDate: '2024-01-29',
      openTime: '08:00',
      closeTime: '16:00',
      status: 'Cerrada',
      openAmount: 500.0,
      closeAmount: 1250.75,
      totalSales: 15,
      salesAmount: 850.75,
      difference: 0.0,
      shift: 'Mañana'
    },
    {
      id: 2,
      cashier: 'María García',
      openDate: '2024-01-29',
      openTime: '16:00',
      closeTime: null,
      status: 'Abierta',
      openAmount: 600.0,
      closeAmount: null,
      totalSales: 8,
      salesAmount: 425.5,
      difference: null,
      shift: 'Tarde'
    },
    {
      id: 3,
      cashier: 'Carlos López',
      openDate: '2024-01-28',
      openTime: '08:00',
      closeTime: '16:00',
      status: 'Cerrada',
      openAmount: 500.0,
      closeAmount: 980.25,
      totalSales: 12,
      salesAmount: 580.25,
      difference: -5.0,
      shift: 'Mañana'
    },
    {
      id: 4,
      cashier: 'Ana Martínez',
      openDate: '2024-01-28',
      openTime: '16:00',
      closeTime: '23:00',
      status: 'Cerrada',
      openAmount: 600.0,
      closeAmount: 1150.0,
      totalSales: 18,
      salesAmount: 650.0,
      difference: 2.5,
      shift: 'Tarde'
    }
  ];
  dataListCaja: iCaja[] = [];
  filteredRegisters: CashRegister[] = [];
  searchTerm: string = '';
  selectedView: string = 'all';
  loading : boolean = false;
  // displayedColumns: string[] = [
  //   'id', 'cashier', 'date', 'shift', 'status',
  //   'openAmount', 'closeAmount', 'sales', 'difference', 'actions'
  // ];


  displayedColumns: string[] = [
    'id', 'nombre', 'pin', 'isOpen', 'idSucursal', 'acciones'
  ];

  stats = {
    totalRegisters: 0,
    openRegisters: 0,
    todayRegisters: 0,
    totalSales: 0
  };

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cajaService: BoxServiceService,
    private fb: FormBuilder
  ) {
    this.getAllCaja();
  }


  // {
  //   "id": 0,
  //   "nombre": "string",
  //   "pin": 0,
  //   "idSucursal": 0
  // }

  ngOnInit(): void {
    this.updateStats();
    this.applyFilters();
  }


  getAllCaja() {
    this.loading=true;
    this.cajaService.getAll().subscribe((result: ServiceResponse) => {
      if (result.status) {
        this.loading=false;
        this.dataListCaja = result.data;
        this.stats.totalRegisters = result.data.length;
        this.stats.openRegisters = result.data.filter((c: any) => c.isOpen == true).length;
      }
    })
  }

  edit(caja: iCaja) {
    this.cajaService.cajaEdit = caja;
    this.openCreateDialog();
  }


  updateStats(): void {
    this.stats = {
      totalRegisters: this.cashRegisters.length,
      openRegisters: this.cashRegisters.filter(r => r.status === 'Abierta').length,
      todayRegisters: this.cashRegisters.filter(r => r.openDate === '2024-01-29').length,
      totalSales: this.cashRegisters.reduce((sum, r) => sum + r.salesAmount, 0)
    };
  }

  applyFilters(): void {
    this.filteredRegisters = this.cashRegisters.filter(register => {
      const matchesSearch =
        register.cashier.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        register.id.toString().includes(this.searchTerm);

      const matchesView =
        this.selectedView === 'all' ||
        (this.selectedView === 'open' && register.status === 'Abierta') ||
        (this.selectedView === 'closed' && register.status === 'Cerrada') ||
        (this.selectedView === 'today' && register.openDate === '2024-01-29');

      return matchesSearch && matchesView;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onViewChange(): void {
    this.applyFilters();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CashRegisterComponent, {
      width: '500px',
      data: {}
    }).afterClosed().subscribe(c=>{
      this.cajaService.cajaEdit = undefined;
    });
  }
    


  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       // this.createCashRegister(result);
  //     }
  //     this.getAllCaja();
  //   });
  // }

   openShiftListDialog(idCaja : number){
       const dialogRef = this.dialog.open(ShiftListComponent, {
      width: '1600px',  // tu ancho deseado
      maxWidth: '90vw',
      height : '', // opcional, para que no se pase de la pantalla,
      data: {
        idCaja : idCaja
      }
    })
  }

  
   openReportConsolidadDialog(){
       const dialogRef = this.dialog.open(ReporteConsolidadoComponent, {
      width: '450px',
      height: '250px',  // tu ancho deseado
      maxWidth: '90vw',
    })
  }

  createCashRegister(data: any): void {
    const newRegister: CashRegister = {
      id: Math.max(...this.cashRegisters.map(r => r.id)) + 1,
      cashier: data.cashier,
      openDate: new Date().toISOString().split('T')[0],
      openTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
      closeTime: null,
      status: 'Abierta',
      openAmount: data.openAmount,
      closeAmount: null,
      totalSales: 0,
      salesAmount: 0,
      difference: null,
      shift: data.shift
    };

    this.cashRegisters.unshift(newRegister);
    this.updateStats();
    this.applyFilters();

    this.snackBar.open('Caja creada exitosamente', 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  viewDetails(register: CashRegister): void {
    this.snackBar.open(`Viendo detalles de caja #${register.id}`, 'Cerrar', {
      duration: 2000
    });
  }

  manageRegister(register: CashRegister): void {
    this.snackBar.open(`Administrando caja #${register.id}`, 'Cerrar', {
      duration: 2000
    });
  }

  generateReport(register: CashRegister): void {
    this.snackBar.open(`Generando reporte de caja #${register.id}`, 'Cerrar', {
      duration: 2000
    });
  }

  exportData(register: CashRegister): void {
    this.snackBar.open(`Exportando datos de caja #${register.id}`, 'Cerrar', {
      duration: 2000
    });
  }

  deleteRegister(register: CashRegister): void {
    if (confirm(`¿Está seguro de eliminar la caja #${register.id}?`)) {
      this.cashRegisters = this.cashRegisters.filter(r => r.id !== register.id);
      this.updateStats();
      this.applyFilters();

      this.snackBar.open('Caja eliminada exitosamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }
  }

  getDifferenceColor(difference: number | null): string {
    if (difference === null) return '';
    if (difference === 0) return 'text-success';
    if (difference > 0) return 'text-primary';
    return 'text-danger';
  }

  formatCurrency(amount: number | null): string {
    if (amount === null) return '-';
    return `$${amount.toFixed(2)}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }


}
