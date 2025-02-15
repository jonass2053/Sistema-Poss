import { Component, signal } from '@angular/core';
import { importaciones } from '../Core/utilities/material/material';
import { ServiceResponseLogin } from '../interfaces/service-response-login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InformationService } from '../services/information.service';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    importaciones

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(
    private routess: Router,
    private usuario: UsuarioService,
    private fb: FormBuilder,
    private alertasService: AlertServiceService,
    private information: InformationService) { }
  alerta: Boolean = false;
  mensaje: string = "";

  miFormulario: FormGroup = this.fb.group(
    {
      correo: this.fb.control("admin@gmail.com", Validators.required),
      contrasena: this.fb.control("admin", Validators.required),
    },

  )
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  login(): any {

    if (this.miFormulario.valid) {
      this.alerta = true;
      this.usuario.login(this.miFormulario.value).subscribe((data: ServiceResponseLogin) => {

        if (data.status == true) {
          this.alerta = false;
          this.usuario.usuarioLogueado = data.data;
          this.information.idEmpresa = data.data.sucursal.idEmpresa;
          this.information.idSucursal = data.data.sucursal.idSucursal;
          localStorage.setItem('user', JSON.stringify(data))
          document.defaultView?.localStorage.setItem('token', JSON.stringify(data.token))
          this.routess.navigate(['/home'])
          this.alertasService.successAlert(`Bienvenido ${data.data.nombre} ${data.data.apellidos}`);
        }
        else {
          this.mensaje = data.message;
          this.alerta = false;
          console.log("en el else")
        }

      })
    }
    else {
      this.alertasService.warnigAlert(`Complete los campos`);
    }
  }






}



