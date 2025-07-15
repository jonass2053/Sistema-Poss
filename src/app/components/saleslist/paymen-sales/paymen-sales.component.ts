import { Component, Inject, OnInit } from '@angular/core';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { E } from '@angular/cdk/keycodes';
import { BancosService } from 'src/app/services/bancos.service';
import { iBanco } from 'src/app/interfaces/iTermino';
import { InformationService } from 'src/app/services/information.service';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';


@Component({
  selector: 'app-paymen-sales',
  standalone: true,
  imports: [importaciones, FormsModule],
  templateUrl: './paymen-sales.component.html',
  styleUrl: './paymen-sales.component.scss'
})
export class PaymenSalesComponent {
  //NRE CODE
  totalAmount: number = 120.41
  cashValue = 150
  change: number = 0
  selectedPaymentMethod = 'cash';
  quickAmounts = [100, 120, 150, 200, 500, 1000, 2000];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymenSalesComponent>,
    private alertaService: AlertServiceService,
    private  bancoService : BancosService,
    private informationService : InformationService,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
      this.cashValue = data.montoPagar;
      this.totalAmount = data.montoPagar;
      this.miFormulario.patchValue({cashReceived :data.montoPagar })
      this.totalAmount = data.montoPagar;
      this.getAllBancos();
  }

  dataListBanco : iBanco[]=[];
  miFormulario: FormGroup = this.fb.group({
    totalRecibido: this.fb.control(0),
    cambio: this.fb.control(0),
    cashReceived: [this.cashValue, [Validators.required, Validators.min(0)]],
    receiptNumber: ['', Validators.required],
    amountPaid: [this.totalAmount, [Validators.required, Validators.min(0)]],
    bankAccount: ['', Validators.required],
    idMetodoPago : [null],
    idBanco : [null],
    noComprobante: [''],
    observacionPago: [''],

  })

  get changeToReturn(): number {
    const received = this.miFormulario.get('cashReceived')?.value || 0;
    let valor = Math.max(0, received - this.totalAmount);
    this.miFormulario.patchValue({cambio: valor})
    return valor;
  }

  selectPaymentMethod(method: string, value : number): void {
    this.selectedPaymentMethod = method;
    this.miFormulario.patchValue({idMetodoPago : value});
  }

  setQuickAmount(amount: number, evento : any): void {
    let monto = 0;
    if(evento==undefined){
      monto=amount;
    }else{
      monto = evento.target.value;
    }
    this.miFormulario.patchValue({ cashReceived: monto });
    this.cashValue = monto;

  }
  updateChange(): void {
    this.change = Math.max(0, (this.cashValue - this.totalAmount))
  }

  onCancel(): void {
    if (confirm("¿Está seguro que desea cancelar el pago?")) {
      this.cashValue = 0;
      this.updateChange();
      this.dialogRef.close();
    }
  }

  isPaymentValid(): boolean {
    return this.cashValue >= this.totalAmount
  }

  confirmPayment(): void {
    if (this.cashValue >= this.totalAmount) {
      alert(`Pago confirmado. Entregue el cambio de $${this.miFormulario.value.cambio.toFixed(2)}`)
      this.miFormulario.patchValue({ totalRecibido: this.cashValue})
      this.dialogRef.close(this.miFormulario);
    } else {
      alert('else')
      this.alertaService.errorAlert("Para procesar la transación debe saldar la deuda en su totalidad.")
    }

    // onConfirmPayment(): void {
    //   let paymentData: any = {};
    //   switch (this.selectedPaymentMethod) {
    //     case 'cash':
    //       if (this.cashForm.valid) {
    //         paymentData = {
    //           method: 'cash',
    //           cashReceived: this.cashForm.get('cashReceived')?.value,
    //           changeToReturn: this.changeToReturn,
    //           totalAmount: this.totalAmount
    //         };
    //       }
    //       break;

    //     case 'card':
    //       if (this.cardForm.valid) {
    //         paymentData = {
    //           method: 'card',
    //           ...this.cardForm.value,
    //           totalAmount: this.totalAmount
    //         };
    //       }
    //       break;

    //     case 'transfer':
    //       if (this.transferForm.valid) {
    //         paymentData = {
    //           method: 'transfer',
    //           ...this.transferForm.value,
    //           totalAmount: this.totalAmount
    //         };
    //       }
    //       break;
    //   }

    //   if (Object.keys(paymentData).length > 0) {
    //     console.log('Datos del pago:', paymentData);
    //     // Implementar lógica de confirmación
    //   } else {
    //     console.log('Formulario inválido');
    //   }


    // }

  }

  getAllBancos(){
    this.bancoService.getAll(this.informationService.idSucursal).subscribe((result : ServiceResponse)=>{
      if(result.status){
        this.dataListBanco = result.data;
      }
    })
    
  }












  // OLD CODE
  // totalAmount: number = 120.41
  // cashValue = 150
  // change: number = 0
  // quickCashOptions: number[] = [100, 120, 150, 200, 500, 1000, 2000]

  // constructor(private alertaService : AlertServiceService, private dialogRef: MatDialogRef<PaymenSalesComponent>,
  //   @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, ) {
  //   this.cashValue = data.montoPagar;
  //   this.totalAmount = data.montoPagar;
  // }


  // miFormulario: FormGroup = this.fb.group({
  //   totalRecibido: this.fb.control(0),
  //   cambio: this.fb.control(0),
  // })
  // ngOnInit(): void {
  //   this.updateChange()
  // }

  // updateChange(): void {
  //   this.change = Math.max(0, (this.cashValue - this.totalAmount))
  // }

  // setQuickCash(amount: number): void {
  //   this.cashValue = amount
  //   this.updateChange()
  // }

  // confirmPayment(): void {
  //   if (this.cashValue >= this.totalAmount) {
  //     alert(`Pago confirmado. Entregue el cambio de $${this.change.toFixed(2)}`)
  //     this.miFormulario.patchValue({ totalRecibido: this.cashValue, cambio: this.change })
  //     this.dialogRef.close(this.miFormulario);
  //   }else{
  //     alert('else')
  //     this.alertaService.errorAlert("Para procesar la transación debe saldar la deuda en su totalidad.")
  //   }
  // }

  // cancelPayment(): void {
  //   if (confirm("¿Está seguro que desea cancelar el pago?")) {
  //     this.cashValue = 0;
  //     this.updateChange();
  //     this.dialogRef.close();
  //   }
  // }

  // isPaymentValid(): boolean {
  //   return this.cashValue >= this.totalAmount
  // }
}
