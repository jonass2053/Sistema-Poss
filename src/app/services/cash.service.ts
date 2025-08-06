import { Injectable } from '@angular/core';
import { baseUrl } from '../Core/utilities/enviroment.';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { ServiceResponse } from '../interfaces/service-response-login';
import { catchError, Observable } from 'rxjs';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class CashService {


  private headers: HttpHeaders;
  private header: { headers: HttpHeaders }
  url: string = `${baseUrl}/Cash`;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private alertas: AlertServiceService,
    private usuarioService: UsuarioService
  ) {

    this.headers = new HttpHeaders({ 'Authorization': `Bearer ${usuarioService.usuarioLogueado.token}` });
    this.header = { headers: this.headers };
  }

  insert(formualrio: any): any {
    return this.http.post<ServiceResponse>(`${this.url}`, formualrio,this.header).pipe(catchError((error) => {
      console.log(error);
      this.alertas.errorAlert(error);
      return error()
    })
    )
  }

  getById(id: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/${id}`, this.header)
  }
  update(formualrio: any): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.url}`, formualrio, this.header)
  }
  delete(id: number): Observable<ServiceResponse> {
    return this.http.delete<ServiceResponse>(`${this.url}/${id}`,this.header)
  }
  getAll(idSucursal: number, idTurno: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/get_by_idsucursal/${idSucursal}/${idTurno}`,this.header)
  }
  getResumen(idTurno: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/getResumen/${idTurno}`,this.header)
  }

}


