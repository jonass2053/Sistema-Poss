import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertsComponent } from './components/alerts/alerts.component';
import { ButtonsComponent } from './components/buttons/buttons.component';
import { ChipsComponent } from './components/chips/chips.component';
import { ExpansionComponent } from './components/expansion/expansion.component';
import { FormsComponent } from './components/forms/forms.component';
import { GridListComponent } from './components/grid-list/grid-list.component';
import { MenuComponent } from './components/menu/menu.component';
import { ProgressSnipperComponent } from './components/progress-snipper/progress-snipper.component';
import { ProgressComponent } from './components/progress/progress.component';
import { SlideToggleComponent } from './components/slide-toggle/slide-toggle.component';
import { SliderComponent } from './components/slider/slider.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { TooltipsComponent } from './components/tooltips/tooltips.component';
import { ProductComponent } from './dashboard/dashboard-components/product/product.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FullComponent } from './layouts/full/full.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CompanyComponent } from './components/settings/components/company/company.component';
import { LoginComponent } from './login/login.component';
import { RoleComponent } from './components/settings/components/role/role.component';
import { UsersComponent } from './components/settings/components/users/users.component';
import { PaymentTermsComponent } from './components/settings/components/payment-terms/payment-terms.component';
import { NumbersComponent } from './components/settings/components/numbers/numbers.component';
import { TaxesComponent } from './components/settings/components/taxes/taxes.component';
import { SallersComponent } from './components/settings/components/sallers/sallers.component';
import { InventaryComponent } from './components/inventary/inventary.component';
import { ProductsComponent } from './components/inventary/components/products/products.component';
import { ContactosService } from './services/contactos.service';
import { ContactsComponent } from './components/contacts/contacts.component';
import { NewcontactComponent } from './components/contacts/newcontact/newcontact.component';
import { SaleslistComponent } from './components/saleslist/saleslist.component';
import { SalesComponent } from './dashboard/dashboard-components/sales/sales.component';
import { NewsalesComponent } from './components/saleslist/newsales/newsales.component';
import { ViewSalesComponent } from './components/saleslist/view-sales/view-sales.component';
import { CategoryComponent } from './components/inventary/components/category/category.component';
import { ModelsComponent } from './components/inventary/components/models/models.component';
import { BrandComponent } from './components/inventary/components/brand/brand.component';
import { PaymentComponent } from './components/payment/payment.component';
import { NewPayComponent } from './components/payment/new-pay/new-pay.component';
import { InventaryAdjustmentComponent } from './components/inventary/components/inventary-adjustment/inventary-adjustment.component';
import { ShiftsComponent } from './components/shifts/shifts.component';
import { CashManagementComponent } from './components/cash-management/cash-management.component';
import { ReportTicketInvoiceComponent } from './components/saleslist/report-ticket-invoice/report-ticket-invoice.component';
import { SettingInventaryComponent } from './components/settings/components/setting-inventary/setting-inventary.component';
import { ConfiguracionesGeneralesComponent } from './components/settings/components/configuraciones-generales/configuraciones-generales.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { ReportsComponent } from './components/reports/reports.component';
import { CashRegisterListComponentComponent } from './components/cash-register-list-component/cash-register-list-component.component';
import { RecepcionMercanciaComponent } from './components/recepcion-mercancia/recepcion-mercancia.component';

const routes: Routes = [
  {path:'', component :LoginComponent},

  {path:'login', component :LoginComponent},
  {path:"report_ticket_invoice/:id", component : ReportTicketInvoiceComponent},

  {
    path:"",
    component:FullComponent,
    children: [
      {path:"", redirectTo:"/home", pathMatch:"full"},
      {path:"home", component:DashboardComponent},
      {path:"sales", component:DashboardComponent},
      {path:"contacts", component : ContactsComponent},
      {path:"contacts/new/:id/:tipo", component : NewcontactComponent },
      {path:"settings", component : SettingsComponent,
        children : [
        {path: 'company', component: CompanyComponent },
        {path: 'paymentsterms', component : PaymentTermsComponent},
        {path: 'taxes', component : TaxesComponent},
        {path: 'numbers', component : NumbersComponent},
        {path: 'users', component : UsersComponent},
        {path: 'role', component : RoleComponent},
        {path: 'inventary', component : SettingInventaryComponent},
        {path: 'generalsetting', component : ConfiguracionesGeneralesComponent}
        ]
      },


      {path:"settings/company", component : CompanyComponent},
      {path:"settings/role", component : RoleComponent},
      {path:"settings/paymentsterms", component : PaymentTermsComponent},
      {path:"settings/users", component : UsersComponent},
      {path:"settings/numbers", component : NumbersComponent},
      {path:"settings/taxes", component : TaxesComponent},
      {path:"settings/sallers", component : SallersComponent},
      {path:"settings/models", component : ModelsComponent},
      {path:"settings/categories", component : CategoryComponent},
      {path:"settings/brands", component : BrandComponent},
      {path:"inventary", component : InventaryComponent},
      {path:"inventary/product/:id", component : ProductsComponent},
      {path:"inventary/inventary-adjustment", component : InventaryAdjustmentComponent},
      {path:"shifts", component : ShiftsComponent},
      {path:"cashregisterlist", component : CashRegisterListComponentComponent},

     // Vista del listado
      {path:"sales/salelist", component : SaleslistComponent},
      {path:"sales/pricelist", component : SaleslistComponent},
      {path:"sales/conducelist", component : SaleslistComponent},
      {path:"buys/buylist", component : SaleslistComponent},
      {path:"buys/recepcion", component : RecepcionMercanciaComponent},

      // Vista de creacion
      {path:"sales/newsale/:id/:idtipo", component : NewsalesComponent},
      {path:"sales/newprice/:id/:idtipo", component : NewsalesComponent},
      {path:"sales/newconduce/:id/:idtipo", component : NewsalesComponent},
      {path:"buys/newbuy/:id/:idtipo", component : NewsalesComponent},


      // Vista de detalle
      {path:"sales/newsales/view/:id/:idtipo", component : ViewSalesComponent},
      {path:"sales/newprice/view/:id/:idtipo", component : ViewSalesComponent},
      {path:"sales/newconduce/view/:id/:idtipo", component : ViewSalesComponent},
      {path:"buys/newbuy/view/:id/:idtipo", component : ViewSalesComponent},

      


      {path:"sales/payment", component : PaymentComponent},
      {path:"payment/newpay", component : NewPayComponent},
      {path:"cash-management", component : CashManagementComponent},
      {path:"reports", component : ReportsComponent},


      {path:"alerts", component:AlertsComponent},
      {path:"forms", component:FormsComponent},
      {path:"table", component:ProductComponent},
      {path:"grid-list", component:GridListComponent},
      {path:"menu", component:MenuComponent},
      {path:"tabs", component:TabsComponent},
      {path:"expansion", component:ExpansionComponent},
      {path:"chips", component:ChipsComponent},
      {path:"progress", component:ProgressComponent},
      {path:"toolbar", component:ToolbarComponent},
      {path:"progress-snipper", component:ProgressSnipperComponent},
      {path:"snackbar", component:SnackbarComponent},
      {path:"slider", component:SliderComponent},
      {path:"slide-toggle", component:SlideToggleComponent},
      {path:"tooltip", component:TooltipsComponent},
      {path:"button", component:ButtonsComponent},
    ]
  },

  {path:"", redirectTo:"/login", pathMatch:"full"},
  // {path:"**", redirectTo:"/login", pathMatch:"full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
