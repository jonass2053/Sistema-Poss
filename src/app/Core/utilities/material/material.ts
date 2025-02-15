import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import {MatRadioModule} from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatStepperModule} from '@angular/material/stepper';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatTabsModule} from '@angular/material/tabs';
import {MatPaginatorModule} from '@angular/material/paginator';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatChipsModule} from '@angular/material/chips'
import {MatTableModule} from '@angular/material/table';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';





 export const  material : any =[
  MatFormFieldModule,
  CommonModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  ReactiveFormsModule,
  CommonModule,
  RouterLink,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatRadioModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatCardModule,
  MatDatepickerModule,
  

]

export const  importaciones : any =[
  RouterLink,
  ReactiveFormsModule,
  CommonModule,
  HttpClientModule,
  MatFormFieldModule,
  CommonModule,
  MatIconModule,
  MatInputModule,
  ReactiveFormsModule,
  CommonModule,
  RouterLink,
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
  MatIconModule,
  MatListModule,
  MatDividerModule,
  MatTabsModule,
  MatPaginatorModule,
  MatCardModule, MatChipsModule, MatProgressBarModule,
  MatTableModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule,
  MatProgressBarModule


]

import { MatDateFormats } from '@angular/material/core';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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




