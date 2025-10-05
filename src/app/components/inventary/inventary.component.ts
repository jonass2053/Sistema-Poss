import { Component, inject } from '@angular/core';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { UsersComponent } from "../settings/components/users/users.component";
import { Router } from '@angular/router';
import { InformationService } from 'src/app/services/information.service';
import { ProductoService } from 'src/app/services/producto.service';
import { iAlmacen, iCategoria, iCuentas, iiMpuesto, iImpuestoProductoCodigo, iMarca, iModelo, iMoneda, iProducto, iUnidades } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { ThemePalette } from '@angular/material/core';
import { MarcasService } from 'src/app/services/marcas.service';
import { ModelosService } from 'src/app/services/modelos.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { CategoryComponent } from "./components/category/category.component";
import { ModelsComponent } from "./components/models/models.component";
import { BrandComponent } from "./components/brand/brand.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NodataComponent } from '../nodata/nodata.component';
import { GetBarCodeComponent } from 'src/app/get-bar-code/get-bar-code.component';
import { MatDialog } from '@angular/material/dialog';
import { TooltipModule } from 'primeng/tooltip';

export interface PeriodicElement {
  id: number;
  name: string;
  work: string;
  project: string;
  priority: string;
  badge: string;
  budget: string;
}


@Component({
  selector: 'app-inventary',
  standalone: true,
  imports: [
    importaciones,
    CategoryComponent,
    ModelsComponent,
    BrandComponent,
    NodataComponent,
    TooltipModule
],
  templateUrl: './inventary.component.html',
  styleUrl: './inventary.component.scss'
})
export class InventaryComponent {
  displayedColumns: string[] = ['imagen', 'idProducto', 'barCode','nombre', 'precioBase', 'impuesto', 'cantInicial','estado', 'acciones'];
  dataList: iProducto[] = [];
  moneda!: iMoneda;
  impuestosCodigos: iImpuestoProductoCodigo[] = [];
  impuestosData: iiMpuesto[] = [];
  dataListAlmacenes: iAlmacen[] = [];
  dataListUnidades: iUnidades[] = [];
  dataListCategoria: iCategoria[] = [];
  dataListCuentas: iCuentas[] = [];
  dataListImpuesto: iiMpuesto[] = [];
  dataListMarcas: iMarca[] = [];
  dataListModelos: iModelo[] = [];
  cargando: boolean = false;
  sinRegistros: boolean = false;
  // sinRegistrosTxt: string = this.msjService.msjSinRegistros;
  checked = false;
  color: ThemePalette = 'primary';
  disabled = false;
  documentoSeleccionado: any = "";
  selectedFile: File | undefined;
  imageUrl: string | ArrayBuffer | null = null;
  formData = new FormData();
  isProduct: boolean = false;
  impuestoArray: Array<iiMpuesto> = [];
   visible: boolean = false;

    showDialog() {
        this.visible = true;
    }

  constructor(
    private router: Router,
    private informationService: InformationService,
    private productoService: ProductoService,
    private usuarioService: UsuarioService,
    public alertasService: AlertServiceService,
    private marcaService: MarcasService,
    private modeloService: ModelosService,
    private categoriaService: CategoriaService,
    private fb : FormBuilder,

    ) {
    this.getAll();
    this.moneda = this.usuarioService.usuarioLogueado.data.sucursal.empresa.moneda;
    this.getAllUnidadesFilter('a');
  }

      readonly dialog = inject(MatDialog);



  goToNewProduct(idProducto: number) {
    this.router.navigate([`inventary/product/${idProducto}`]);
    this.productoService.productoForEdit.idProducto = 0;
  }

  getAll() {
    this.loading();
    this.productoService.getAll(this.informationService.idSucursal).subscribe((data: any) => {
      this.dataList = data.data;
      if (this.dataList.length > 0) {
        this.loading();
      }
      else {
        this.sinRegistros = true;
        this.loading();
      }

    })
  }

  async delete(id: any) {
    if (await this.alertasService.questionDelete()) {
      this.productoService.delete(id).subscribe(((data: ServiceResponse) => {
        if (data.status) {
          this.alertasService.successAlert(data.message);
          this.getAll();
        }
        else {
          this.alertasService.errorAlert(data.message)
        }
      }))
    }
  }

  getAllUnidadesFilter(filter: string) {
    if (filter != null && filter.length > 0) {
      this.productoService.getAllUnidadesFilter(filter).subscribe((data: any) => {
        this.dataListUnidades = data.data;
      })
    }
  }




  onFileSelected(event: any) {
    this.formData.append('imagen', (event.target.files[0] as File))
    this.selectedFile = event.target.files[0] as File;
    this.previewImage();
  }
  previewImage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
    }
  }



  getAllFilter(event: any) {
    const filtro = (event.target as HTMLInputElement).value;
    if (filtro == "") {
      this.getAll();
    }
    else {
      this.loading();
      this.productoService.getAllFilter(filtro, this.informationService.idSucursal).subscribe((data: any) => {
        this.dataList = data.data;
        if (this.dataList.length > 0) {
          this.sinRegistros = false
        }
        else {
          this.sinRegistros = true;
        }
      })
      this.loading();
    }
  }





  //Set precio total controla el impuesto
  contadorExecnto: number = 0;





  getMarcas(idCategoria: number) {
    this.marcaService.getByIdCategoria(idCategoria).subscribe((data: ServiceResponse) => {
      this.dataListMarcas = data.data;
    })
  }

  getModelos(idMarca: number) {
    this.modeloService.getByIdMarca(idMarca).subscribe((data: ServiceResponse) => {
      this.dataListModelos = data.data;
    })
  }

  editar(producto: iProducto) {
    this.productoService.productoForEdit = producto;
    this.goToNewProduct(producto.idProducto!);

  }

  loading() {
    if (this.cargando === false) {
      this.cargando = true;
    }
    else {
      this.cargando = false;
    }

  }

  openDialogGenerateCodeBar(id : number) {
    const dialogRef = this.dialog.open(GetBarCodeComponent, { width : '500px', height : '350px', data : {id}});
    dialogRef.afterClosed().subscribe(result => {
    });
  }


}
