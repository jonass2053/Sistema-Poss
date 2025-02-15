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

const routes: Routes = [
  {path:'', component :LoginComponent},

  {path:'login', component :LoginComponent},
  {
    path:"",
    component:FullComponent,
    children: [
      {path:"", redirectTo:"/home", pathMatch:"full"},
      {path:"home", component:DashboardComponent},
      {path:"sales", component:DashboardComponent},
      {path:"contacts", component : ContactsComponent},
      {path:"contacts/new/:id", component : NewcontactComponent },
      {path:"settings", component : SettingsComponent},
      {path:"settings/company", component : CompanyComponent},
      {path:"settings/role", component : RoleComponent},
      {path:"settings/paymentsterms", component : PaymentTermsComponent},
      {path:"settings/users", component : UsersComponent},
      {path:"settings/numbers", component : NumbersComponent},
      {path:"settings/taxes", component : TaxesComponent},
      {path:"settings/sallers", component : SallersComponent},
      {path:"inventary", component : InventaryComponent},
      {path:"inventary/product/:id", component : ProductsComponent},
      {path:"sales/salelist", component : SaleslistComponent},
      {path:"sales/pricelist", component : SaleslistComponent},
      {path:"sales/newsale/:id", component : NewsalesComponent},
      {path:"sales/newprice/:id", component : NewsalesComponent},
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
  {path:"**", redirectTo:"/login", pathMatch:"full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
