import { Component, Inject, OnInit } from '@angular/core';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-paymen-sales',
  standalone: true,
  imports: [importaciones, FormsModule],
  templateUrl: './paymen-sales.component.html',
  styleUrl: './paymen-sales.component.scss'
})
export class PaymenSalesComponent implements OnInit {
  totalAmount: number = 120.41
  cashValue = 150
  change: number = 0
  quickCashOptions: number[] = [100, 120, 150, 200, 500, 1000, 2000]

  constructor(private dialogRef: MatDialogRef<PaymenSalesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,) {
    this.cashValue = data.montoPagar;
    this.totalAmount = data.montoPagar;
  }


  miFormulario: FormGroup = this.fb.group({
    totalRecibido: this.fb.control(0),
    cambio: this.fb.control(0),
  })
  ngOnInit(): void {
    this.updateChange()
  }

  updateChange(): void {
    this.change = Math.max(0, (this.cashValue - this.totalAmount))
  }

  setQuickCash(amount: number): void {
    this.cashValue = amount
    this.updateChange()
  }

  confirmPayment(): void {
    if (this.cashValue >= this.totalAmount) {
      alert(`Pago confirmado. Entregue el cambio de $${this.change.toFixed(2)}`)
      this.miFormulario.patchValue({ totalRecibido: this.cashValue, cambio: this.change })
      this.dialogRef.close(this.miFormulario);
    }
  }

  cancelPayment(): void {
    if (confirm("¿Está seguro que desea cancelar el pago?")) {
      this.cashValue = 0;
      this.updateChange();
      this.dialogRef.close();
    }
  }

  isPaymentValid(): boolean {
    return this.cashValue >= this.totalAmount
  }
}
