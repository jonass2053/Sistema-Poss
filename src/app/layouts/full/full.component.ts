import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { FacturaService } from 'src/app/services/factura.service';
import { InformationService } from 'src/app/services/information.service';
import { Router } from '@angular/router';
import { Link } from 'angular-feather/icons';

interface sidebarMenu {
  link: string;
  icon: string;
  menu: string;
  chield :  sidebarMenuChild[]
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

export class FullComponent {

  search: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private facturaService : FacturaService, 
    private information : InformationService,
    private router : Router) { }

  routerActive: string = "activelink";
  listIngresos : boolean =false;
  listInventario : boolean =false;
  rowIcon : boolean = false;

  showListVentas(){
    this.listIngresos==false? this.listIngresos=true : this.listIngresos=false;
    this.rowIcon==false?   this.rowIcon=true :   this.rowIcon=false;
  }
  sidebarMenu: sidebarMenu[] = [
    {
      link: "/sales",
      icon: "shopping-cart",
      menu: "Ventas",
      chield :  [
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
      icon: "users",
      menu: "Contactos",
      chield : []

    },{
      link: "/inventary",
      icon: "package",
      menu: "Inventario",
      chield : []

    },
    {
      link: "/settings",
      icon: "settings",
      menu: "Configuraciones",
      chield : []

    },
    {
      link: "/home",
      icon: "home",
      menu: "Dashboard",
      chield : []

    },
    {
      link: "/button",
      icon: "disc",
      menu: "Buttons",
      chield : []

    },
    {
      link: "/forms",
      icon: "layout",
      menu: "Forms",
      chield : []

    },
    {
      link: "/alerts",
      icon: "info",
      menu: "Alerts",
      chield : []

    },
    {
      link: "/grid-list",
      icon: "file-text",
      menu: "Grid List",
      chield : []

    },
    {
      link: "/menu",
      icon: "menu",
      menu: "Menus",
      chield : []

    },
    {
      link: "/table",
      icon: "grid",
      menu: "Tables",
      chield : []

    },
    {
      link: "/expansion",
      icon: "divide-circle",
      menu: "Expansion Panel",
      chield : []

    },
    {
      link: "/chips",
      icon: "award",
      menu: "Chips",
      chield : []

    },
    {
      link: "/tabs",
      icon: "list",
      menu: "Tabs",
      chield : []

    },
    {
      link: "/progress",
      icon: "bar-chart-2",
      menu: "Progress Bar",
      chield : []

    },
    {
      link: "/toolbar",
      icon: "voicemail",
      menu: "Toolbar",
      chield : []

    },
    {
      link: "/progress-snipper",
      icon: "loader",
      menu: "Progress Snipper",
      chield : []

    },
    {
      link: "/tooltip",
      icon: "bell",
      menu: "Tooltip",
      chield : []

    },
    {
      link: "/snackbar",
      icon: "slack",
      menu: "Snackbar",
      chield : []

    },
    {
      link: "/slider",
      icon: "sliders",
      menu: "Slider",
      chield : []

    },
    {
      link: "/slide-toggle",
      icon: "layers",
      menu: "Slide Toggle",
      chield : []

    },
  ];

  selectDocument(tipoDocument : string){
    this.facturaService.document = tipoDocument;
    this.information.tipoDocumento = tipoDocument;
    localStorage.setItem("tipoDocumento", tipoDocument);
  if(tipoDocument==="Cotización"){
    this.router.navigate(['sales/pricelist']); 
  }
  else {
    this.router.navigate(['sales/salelist']); 
  }
}

}
