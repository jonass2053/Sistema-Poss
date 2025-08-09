import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ServiceResponse } from '../interfaces/service-response-login';
import { catchError, Observable } from 'rxjs';
import { baseUrl } from '../Core/utilities/enviroment.';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { UsuarioService } from './usuario.service';


@Injectable({
  providedIn: 'root'
})
export class BancosService {
  private headers: HttpHeaders;
  private header: { headers: HttpHeaders }
  url: string = `${baseUrl}/Banco`;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private alertas: AlertServiceService,
    private usuarioService: UsuarioService
  ) {
    this.headers = new HttpHeaders({ 'Authorization': `Bearer ${usuarioService.usuarioLogueado.token}` });
    this.header = { headers: this.headers };
  }


  insert(formulario: any): any {
    return this.http.post<ServiceResponse>(`${this.url}`, formulario, this.header).pipe(catchError((error) => {
      console.log(error);
      this.alertas.errorAlert(error);
      return error()
    })
    )
  }
  update(formulario: any): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.url}`, formulario, this.header)
  }
  delete(id: number): Observable<ServiceResponse> {
    return this.http.delete<ServiceResponse>(`${this.url}/${id}`, this.header)
  }
  getAll(idSucursal: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/getAll/${idSucursal}`, this.header)
  }
  getTipoCuenta(): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/get_tipo_cuenta_banck`, this.header)
  }
}
