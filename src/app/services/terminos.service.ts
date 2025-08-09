import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ServiceResponse } from '../interfaces/service-response-login';
import { Observable, catchError } from 'rxjs';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { baseUrl } from '../Core/utilities/enviroment.';
import { UsuarioService } from './usuario.service';


@Injectable({
  providedIn: 'root'
})
export class TerminosService {
  private headers: HttpHeaders;
  private header: { headers: HttpHeaders }
  url: string = `${baseUrl}/Terminos`;
  constructor(
    private http: HttpClient,
    private alertas: AlertServiceService,
    private usuarioService: UsuarioService
  ) {
    this.headers = new HttpHeaders({ 'Authorization': `Bearer ${usuarioService.usuarioLogueado.token}` });
    this.header = { headers: this.headers };
  }

  resetTurno() {

  }

  insert(formualrio: any): any {
    return this.http.post<ServiceResponse>(`${this.url}`, formualrio, this.header).pipe(catchError((error) => {
      console.log(error);
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
    return this.http.get<ServiceResponse>(`${this.url}`, this.header)
  }

  setDefautlTermino(idTermino: number): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(`${this.url}/setdefault`, idTermino, this.header)
  }
}
