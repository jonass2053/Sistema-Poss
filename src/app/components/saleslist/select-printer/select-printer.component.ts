import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { importaciones } from 'src/app/Core/utilities/material/material';

@Component({
  selector: 'app-select-printer',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './select-printer.component.html',
  styleUrl: './select-printer.component.scss'
})
export class SelectPrinterComponent {
   constructor(private dialogRef: MatDialogRef<SelectPrinterComponent>){

   }

   closeModal(valor : number){
    this.dialogRef.close(valor);
   }
}
