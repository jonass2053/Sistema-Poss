import { Component } from '@angular/core';
import { CategoryComponent } from 'src/app/components/inventary/components/category/category.component';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { BrandComponent } from "../../../inventary/components/brand/brand.component";
import { ModelsComponent } from 'src/app/components/inventary/components/models/models.component';

@Component({
  selector: 'app-setting-inventary',
  standalone: true,
  imports: [importaciones,
    CategoryComponent, BrandComponent, ModelsComponent],
  templateUrl: './setting-inventary.component.html',
  styleUrl: './setting-inventary.component.scss'
})
export class SettingInventaryComponent {

}
  