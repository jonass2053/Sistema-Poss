import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

/* Angular Material */
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  MatDialogModule,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';

/* PrimeNG */
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';   // ✅ Corregido
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';

/* Otros */
import { NgxPrintModule } from 'ngx-print';

/* Fechas personalizadas */
import { MatDateFormats, provideNativeDateAdapter } from '@angular/material/core';

export const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

/* Exportamos agrupados */
export const importaciones: any = [
  /* Angular */
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  RouterLink,
  HttpClientModule,

  /* Material */
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatSelectModule,
  MatRadioModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatCardModule,
  MatDatepickerModule,
  MatTooltipModule,
  MatAutocompleteModule,
  MatStepperModule,
  MatButtonModule,
  MatListModule,
  MatDividerModule,
  MatTabsModule,
  MatPaginatorModule,
  MatChipsModule,
  MatProgressBarModule,
  MatTableModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatButtonToggleModule,
  MatSidenavModule,

  /* PrimeNG */
  TableModule,
  DialogModule,   // ✅ ya no error
  ButtonModule,
  InputTextModule,
  AvatarModule,

  /* Otros */
  NgxPrintModule,
];
