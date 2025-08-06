import { Injectable } from '@angular/core';
import { ServiceResponse } from '../interfaces/service-response-login';
import { Observable, catchError } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl } from '../Core/utilities/enviroment.';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { UsuarioService } from './usuario.service';


@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  url: string = `${baseUrl}/Almacen`;
  private headers: HttpHeaders;
  private header: { headers: HttpHeaders }

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private alertas: AlertServiceService,
    private usuarioService : UsuarioService
  ) {
    this.headers = new HttpHeaders({ 'Authorization': `Bearer ${usuarioService.usuarioLogueado.token}` });
    this.header = { headers: this.headers };
   }

  insert(formualrio: any): any {
    return this.http.post<ServiceResponse>(`${this.url}`, formualrio, this.header).pipe(catchError((error) => {
      this.alertas.errorAlert(error);
      return error()
    })
    )
  }
  update(formualrio: any): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.url}`, formualrio, this.header)
  }
  delete(id: number): Observable<ServiceResponse> {
    return this.http.delete<ServiceResponse>(`${this.url}/${id}`, this.header)
  }
  getAll(): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}`, this.header )
  }
}
