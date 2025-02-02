import { Component } from '@angular/core';
import { UsuarioService } from './services/usuario.service';
import { InformationService } from './services/information.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sistema POS';
  constructor(private usuario : UsuarioService, private information : InformationService){
    if (typeof document !== 'undefined') {
     usuario.usuarioLogueado = JSON.parse(document.defaultView?.localStorage.getItem('user')!);
     information.idEmpresa =  usuario.usuarioLogueado.data.sucursal.idEmpresa;
     information.idSucursal = usuario.usuarioLogueado.data.sucursal.idSucursal;
     information.tipoDocumento  = localStorage.getItem('tipoDocumento')!;
  }
 
  }
}
