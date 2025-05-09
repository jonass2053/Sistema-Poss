import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { iTurno } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { InformationService } from 'src/app/services/information.service';
import { ShiftsService } from 'src/app/services/shifts.service';
import { CloseShiftComponent } from './close-shift/close-shift.component';




@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [importaciones],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.scss'
})
export class ShiftsComponent {
  readonly dialog = inject(MatDialog);

  datalist: iTurno[] = [];


  constructor(
    private turnoService: ShiftsService,
    private alertasService: AlertServiceService,
    private informationService: InformationService
  ) {
    this.getAll();
  }
  getAll() {
    this.turnoService.getAll(this.informationService.idSucursal).subscribe((data: ServiceResponse) => {
      if (data.status) {
        this.datalist = data.data;
      }
    })
  }

  openModalCloseShift() {
    const dialogRef = this.dialog.open(CloseShiftComponent, {width : '1600px'});
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
