import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { firstValueFrom, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { FacturaService } from 'src/app/services/factura.service';
import { InformationService } from 'src/app/services/information.service';
import { Router } from '@angular/router';
import { Link } from 'angular-feather/icons';
import { MatDialog } from '@angular/material/dialog';
import { OpenShiftComponent } from 'src/app/components/shifts/open-shift/open-shift.component';
import { CloseShiftComponent } from 'src/app/components/shifts/close-shift/close-shift.component';
import { ShiftsService } from 'src/app/services/shifts.service';
import { parse } from 'date-fns';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';

interface sidebarMenu {
  link: string;
  icon: string;
  menu: string;
  chield: sidebarMenuChild[]
}

interface sidebarMenuChild {
  link: string;
  icon: string;
  menu: string;
}

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})

export class FullComponent implements OnInit {

  search: boolean = false;
  readonly dialog = inject(MatDialog);


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private facturaService: FacturaService,
    private information: InformationService,
    public usuarioService: UsuarioService,
    public turnoService: ShiftsService,
    private router: Router) {


  }
   ngOnInit(): void {
     this.getTurnoActualExeq();

  }

  getTurnoActualExeq() {
   this.turnoService.getTurnoActual(this.information.idUsuario, this.information.idSucursal).subscribe((data: ServiceResponse) => {

      if (data.statusCode == 200) {
        this.turnoService.isOpen = data.data == null ? undefined : data.data;
        let userLocal = localStorage.getItem('user');
        if (userLocal != undefined && userLocal != null) {
          //  userLocal.data.idTurno = data.data.idTurno;
          userLocal = JSON.parse(userLocal);
          localStorage.removeItem('user');
          localStorage.setItem('user', JSON.stringify(userLocal))
          this.information.idTurno = data.data.idTurno;
        }
      }
    })
  }

    routerActive: string = "activelink";
    listIngresos: boolean = false;
    listInventario: boolean = false;
    rowIcon: boolean = false;
    listCaja: boolean = false;
    rowIconCaja: boolean = false;


    showListVentas() {
      this.listIngresos == false ? this.listIngresos = true : this.listIngresos = false;
      this.rowIcon == false ? this.rowIcon = true : this.rowIcon = false;
    }
    showListCaja() {
      this.listCaja == false ? this.listCaja = true : this.listCaja = false;
      this.rowIconCaja == false ? this.rowIconCaja = true : this.rowIconCaja = false;
    }
    showInvetario() {
      this.listInventario == false ? this.listInventario = true : this.listInventario = false;
    }

    openShift(): void {
      this.dialog.open(CloseShiftComponent, {
        width: '450px',
      })
    }


    sidebarMenu: sidebarMenu[] = [
      {
        link: "/sales",
        icon: "fa-solid fa-cart-shopping",
        menu: "Ventas",
        chield: [
          {
            link: "/invoice",
            icon: "shopping-cart",
            menu: "Facturas"
          },
          {
            link: "/invoice",
            icon: "shopping-cart",
            menu: "Pagos recibidos"
          },
          {
            link: "/contizaciones",
            icon: "shopping-cart",
            menu: "Cotizaciones",
          }

        ]

      },
      {
        link: "/contacts",
        icon: "fa-solid fa-money-check-dollar",
        menu: "POS",
        chield: []

      },
      {
        link: "/contacts",
        icon: "fa-solid fa-users",
        menu: "Contactos",
        chield: []

      },
      {
        link: "/inventary",
        icon: "fa-solid fa-warehouse",
        menu: "Inventario",
        chield: []
      },
      {
        link: "/",
        icon: "fa-solid fa-cash-register",
        menu: "Caja",
        chield: []
      },
      //     {
      //   link: "/reports",
      //   icon: "fa-solid fa-cash-register",
      //   menu: "Reportes",
      //   chield: []
      // },
      // {
      //   link: "/cash-management",
      //   icon: "fa-solid fa-money-bill",
      //   menu: "Manejo de efectivo",
      //   chield: [
      //     {
      //       link: "/invoice",
      //       icon: "shopping-cart",
      //       menu: "Facturas"
      //     },
      //     {
      //       link: "/invoice",
      //       icon: "shopping-cart",
      //       menu: "Pagos recibidos"
      //     },
      //     {
      //       link: "/contizaciones",
      //       icon: "shopping-cart",
      //       menu: "Cotizaciones",
      //     }

      //   ]


      // },
      //   {
      //   link: "/reports",
      //   icon: "analytics",
      //   menu: "Reportes",
      //   chield: []

      // },

      {
        link: "/settings",
        icon: "fa-solid fa-gear",
        menu: "Configuraciones",
        chield: []

      }

      // {
      //   link: "/home",
      //   icon: "home",
      //   menu: "Dashboard",
      //   chield : []

      // },
      // {
      //   link: "/button",
      //   icon: "disc",
      //   menu: "Buttons",
      //   chield : []

      // },
      // {
      //   link: "/forms",
      //   icon: "layout",
      //   menu: "Forms",
      //   chield : []

      // },
      // {
      //   link: "/alerts",
      //   icon: "info",
      //   menu: "Alerts",
      //   chield : []

      // },
      // {
      //   link: "/grid-list",
      //   icon: "file-text",
      //   menu: "Grid List",
      //   chield : []

      // },
      // {
      //   link: "/menu",
      //   icon: "menu",
      //   menu: "Menus",
      //   chield : []

      // }
      // {
      //   link: "/table",
      //   icon: "grid",
      //   menu: "Tables",
      //   chield : []

      // },
      // {
      //   link: "/expansion",
      //   icon: "divide-circle",
      //   menu: "Expansion Panel",
      //   chield : []

      // },
      // {
      //   link: "/chips",
      //   icon: "award",
      //   menu: "Chips",
      //   chield : []

      // },
      // {
      //   link: "/tabs",
      //   icon: "list",
      //   menu: "Tabs",
      //   chield : []

      // },
      // {
      //   link: "/progress",
      //   icon: "bar-chart-2",
      //   menu: "Progress Bar",
      //   chield : []

      // },
      // {
      //   link: "/toolbar",
      //   icon: "voicemail",
      //   menu: "Toolbar",
      //   chield : []

      // },
      // {
      //   link: "/progress-snipper",
      //   icon: "loader",
      //   menu: "Progress Snipper",
      //   chield : []

      // },
      // {
      //   link: "/tooltip",
      //   icon: "bell",
      //   menu: "Tooltip",
      //   chield : []

      // },
      // {
      //   link: "/snackbar",
      //   icon: "slack",
      //   menu: "Snackbar",
      //   chield : []

      // },
      // {
      //   link: "/slider",
      //   icon: "sliders",
      //   menu: "Slider",
      //   chield : []

      // },
      // {
      //   link: "/slide-toggle",
      //   icon: "layers",
      //   menu: "Slide Toggle",
      //   chield : []

      // },
    ];

    selectDocument(tipoDocument: string) {
      this.facturaService.document = tipoDocument;
      this.information.tipoDocumento = tipoDocument;
      localStorage.setItem("tipoDocumento", tipoDocument);
      if (tipoDocument === "Cotización") {
        this.router.navigate(['sales/pricelist']);
      }
      else {
        this.router.navigate(['sales/salelist']);
      }
    }

    openModalCloseShift() {
      const dialogRef = this.dialog.open(CloseShiftComponent, { width: '2500px' });
    }
    facturar(idDocument: number, isPos : boolean) {
      localStorage.setItem("isPos", JSON.stringify(isPos));
      this.information.isPos = isPos;
      this.information.setTipoDocumento("Factura")
      this.facturaService.document = "Factura";
      // if (this.facturaService.document === "Cotización") {
      //   this.router.navigate([`sales/newprice/${idDocument}/6`]);
      // }
      this.router.navigate([`sales/newsale/${idDocument}/1`]);
    }


  }
