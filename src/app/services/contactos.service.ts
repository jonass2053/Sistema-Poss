import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServiceResponse } from '../interfaces/service-response-login';
import { Observable, catchError } from 'rxjs';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { baseUrl } from '../Core/utilities/enviroment.';
import { UsuarioService } from './usuario.service';


@Injectable({
  providedIn: 'root'
})
export class ContactosService {
  private headers: HttpHeaders;
  private header: { headers: HttpHeaders }
  url: string = `${baseUrl}/Contacto`;
  constructor(
    private http: HttpClient,
    private alertas: AlertServiceService,
    private usuarioService : UsuarioService
  ) {
    this.headers = new HttpHeaders({ 'Authorization': `Bearer ${usuarioService.usuarioLogueado.token}` });
    this.header = { headers: this.headers };
  }


  insert(formulario: any): any {
    return this.http.post<ServiceResponse>(`${this.url}`, formulario,this.header).pipe(catchError((error) => {
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
  getById(id: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/${id}`, this.header)
  }
  getByIdTipo(id: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/getbytipo/${id}`, this.header)
  }
  getAll(idEmpresa : number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}?idEmpresa=${idEmpresa}`, this.header)
  }
  getAllFilter(filter: string, idEmpresa : number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/getallfilter/${filter}?idEmpresa=${idEmpresa}`, this.header)
  }
  getAllTipoContacto(): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/tipo-contactos`, this.header)
  }
  setDefaultCustumer(id : number, idEmpresa : number): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.url}/set_default_custumer?id=${id}&idEmpresa=${idEmpresa}`, {}, this.header)
  }

}
