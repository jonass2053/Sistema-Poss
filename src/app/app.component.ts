import { Component } from '@angular/core';
import { UsuarioService } from './services/usuario.service';
import { InformationService } from './services/information.service';
import { ShiftsService } from './services/shifts.service';
import { ShiftsComponent } from './components/shifts/shifts.component';
import { FacturaService } from './services/factura.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sistema POS';
  constructor(private usuario : UsuarioService, private information : InformationService, private turnoService : ShiftsService){

     usuario.usuarioLogueado = JSON.parse(document.defaultView?.localStorage.getItem('user')!);
     if(usuario.usuarioLogueado){
      information.idEmpresa =  usuario.usuarioLogueado.data.sucursal.idEmpresa;
      information.idSucursal = usuario.usuarioLogueado.data.sucursal.idSucursal;
      information.idUsuario = usuario.usuarioLogueado.data.idUsuario;
      information.idTurno = usuario.usuarioLogueado.data.idTurno;
      information.tipoDocumento  = localStorage.getItem('tipoDocumento')!;
      information.mySucursal = usuario.usuarioLogueado.data.sucursal;
      information.isPos = (localStorage.getItem('isPos')!)=="true"? true: false;
      turnoService.getTurnoActualExeq();
     }

  }
}

