import { Component } from '@angular/core';
import { importaciones } from 'src/app/Core/utilities/material/material';
export interface Section {
  name: string;
  updated: Date;
}
@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [importaciones],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.scss'
})
export class ShiftsComponent {
  datalist: Section[] = [
    {
      name: 'Cierre No. 1',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Cierre No. 2',
      updated: new Date('1/1/16'),
    },
    
   
  ];
}
