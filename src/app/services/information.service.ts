import { Injectable } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { iEmpresa, iSucursal } from '../interfaces/iTermino';
import { Router } from '@angular/router';
import { AlertServiceService } from '../Core/utilities/alert-service.service';

@Injectable({
  providedIn: 'root'
})
export class InformationService {
  constructor(private router : Router, private alertasService : AlertServiceService){}
  isPos : boolean = false;
  idEmpresa: number=0;
  idSucursal : number=0;
  tipoDocumento : string="";
  idUsuario! : number;
  idTurno! : number;
  mySucursal! : iSucursal;


 
}
