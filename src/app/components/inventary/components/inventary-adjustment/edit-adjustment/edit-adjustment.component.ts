import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { iAjusteInventarioGet } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-edit-adjustment',
  standalone: true,
  imports: [importaciones],
  templateUrl: './edit-adjustment.component.html',
  styleUrl: './edit-adjustment.component.scss'
})
export class EditAdjustmentComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: iAjusteInventarioGet,
    private fb : FormBuilder,
    private dialogRef: MatDialogRef<EditAdjustmentComponent>,
    private productoService : ProductoService,
    private alertas : AlertServiceService

  ) {
    this.miFormulario.reset(this.data);


  }


  closeModal(){
    this.dialogRef.close();
  }

  miFormulario: FormGroup = this.fb.group({
    idAjuste: this.fb.control(null),
    idProducto: this.fb.control(''),
    stockActual: this.fb.control(0),
    stockAjustado: this.fb.control(0),
    diferencia: this.fb.control(0),
    razonAjuste: this.fb.control(0),
    createdBy: this.fb.control(0),
    idSucursal: this.fb.control(null)

  })


  adjustmentReasons = [
    "Inventario físico",
    "Producto dañado",
    "Error de conteo previo",
    "Robo/Pérdida",
    "Devolución de cliente",
    "Otros"
  ]

  updateAjuste(){
    this.productoService.updateAjusteInventario(this.miFormulario.value).subscribe((data: ServiceResponse)=>{
      if(data.status){
        this.alertas.successAlert(data.message)
        this.closeModal();
      }

    })
  }

  ajustarDiferencia(event : any){
    let montoActualizado :  number =  parseInt(this.miFormulario.value.stockActual) + parseInt(event.target.value);
     this.miFormulario.patchValue({
      'stockAjustado' : montoActualizado
     })
     this.data.stockAjustado =montoActualizado.toString();

  }
}
