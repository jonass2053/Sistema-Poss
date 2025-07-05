import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { iConfiguracion } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { ConfiguracionesFactService } from 'src/app/services/configuraciones.service';
import { InformationService } from 'src/app/services/information.service';
import { PrintServiceService } from 'src/app/services/print-service.service';


@Component({
  selector: 'app-configuraciones-generales',
  standalone: true,
  imports: [importaciones],
  templateUrl: './configuraciones-generales.component.html',
  styleUrl: './configuraciones-generales.component.scss'
})
export class ConfiguracionesGeneralesComponent {

  constructor(
    private configuracinoService : ConfiguracionesFactService,
    private informationService : InformationService,
    private fb : FormBuilder,
    private alertas : AlertServiceService,
    private printService : PrintServiceService){
    this.getAll();
  }

 miFormulario : FormGroup = this.fb.group({
  id : this.fb.control(null, Validators.required),
  impresionAutomatica : this.fb.control(null, Validators.required)
 })
 configuraciones! : iConfiguracion;
 
  getAll(){
    this.configuracinoService.getAll().subscribe((response : ServiceResponse)=>{
      if(response.status){
        console.log(response)
        this.configuraciones = response.data;
        this.miFormulario.reset(response.data)
      }
    })
  }

  saveChange(){
    this.configuracinoService.saveChange(this.miFormulario.value).subscribe((response : ServiceResponse)=>{
      if(response.status){
        this.alertas.successAlert(response.message);
      }
    })
  }
}
