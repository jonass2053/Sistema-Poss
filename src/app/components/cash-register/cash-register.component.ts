import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { importaciones } from 'src/app/Core/utilities/material/material';

@Component({
  selector: 'app-cash-register',
  standalone: true,
  imports: [importaciones],
  templateUrl: './cash-register.component.html',
  styleUrl: './cash-register.component.scss'
})
export class CashRegisterComponent {
cashRegisterForm: FormGroup;

  cashiers = [
    { value: 'Juan Pérez', label: 'Juan Pérez' },
    { value: 'María García', label: 'María García' },
    { value: 'Carlos López', label: 'Carlos López' },
    { value: 'Ana Martínez', label: 'Ana Martínez' }
  ];

  shifts = [
    { value: 'Mañana', label: 'Mañana (08:00 - 16:00)' },
    { value: 'Tarde', label: 'Tarde (16:00 - 23:00)' },
    { value: 'Noche', label: 'Noche (23:00 - 08:00)' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CashRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.cashRegisterForm = this.fb.group({
      cashier: ['', Validators.required],
      shift: ['', Validators.required],
      openAmount: [500.00, [Validators.required, Validators.min(0)]],
      notes: ['']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.cashRegisterForm.valid) {
      this.dialogRef.close(this.cashRegisterForm.value);
    }
  }
}
