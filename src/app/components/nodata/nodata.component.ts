import { Component, Input } from '@angular/core';
import { importaciones } from 'src/app/Core/utilities/material/material';

@Component({
  selector: 'app-nodata',
  standalone: true,
  imports: [importaciones],
  templateUrl: './nodata.component.html',
  styleUrl: './nodata.component.scss'
})
export class NodataComponent {
  @Input() mensaje: string = 'No se encontrarón registros.';

}
