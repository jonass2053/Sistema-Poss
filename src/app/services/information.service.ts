import { Injectable } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { iEmpresa, iSucursal } from '../interfaces/iTermino';

@Injectable({
  providedIn: 'root'
})
export class InformationService {

  idEmpresa: number=0;
  idSucursal : number=0;
  tipoDocumento : string="";
  idUsuario! : number;
  idTurno! : number;
  mySucursal! : iSucursal;
  
}
