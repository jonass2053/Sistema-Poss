import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ServiceResponse } from '../interfaces/service-response-login';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { baseUrl } from '../Core/utilities/enviroment.';
import { UsuarioService } from './usuario.service';
;

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionesFactService {
  private headers: HttpHeaders;
  private header: { headers: HttpHeaders }
  url: string = `${baseUrl}/Configuracion`;
  constructor(
    private http: HttpClient,
    private alertas: AlertServiceService,
    private usuarioService : UsuarioService
  ) {
    this.headers = new HttpHeaders({ 'Authorization': `Bearer ${usuarioService.usuarioLogueado.token}` });
    this.header = { headers: this.headers };
  }


  getAll(): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}`, this.header)
  }

  saveChange(formulario: any): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.url}`, formulario, this.header)
  }
}
