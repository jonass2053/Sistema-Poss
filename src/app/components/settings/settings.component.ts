import { Component, viewChild } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatAccordion } from '@angular/material/expansion';
import { importaciones } from 'src/app/Core/utilities/material/material';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    importaciones,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  accordion = viewChild.required(MatAccordion);

}
