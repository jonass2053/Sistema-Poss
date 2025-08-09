import { Injectable } from '@angular/core';
import { ServiceResponse } from '../interfaces/service-response-login';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { baseUrl } from '../Core/utilities/enviroment.';
import { UsuarioService } from './usuario.service';


@Injectable({
  providedIn: 'root'
})
export class MarcasService {

  private headers: HttpHeaders;
  private header: { headers: HttpHeaders }
  url: string = `${baseUrl}/Marca`;
  constructor(
    private http: HttpClient,
    private alertas: AlertServiceService,
    private usuarioService: UsuarioService
  ) {
    this.headers = new HttpHeaders({ 'Authorization': `Bearer ${usuarioService.usuarioLogueado.token}` });
    this.header = { headers: this.headers };
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
  getById(id: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/${id}`, this.header)
  }
  getByIdCategoria(idCaregoria: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/getallbyidcategoria/${idCaregoria}`, this.header)
  }
  getAll(): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}`, this.header)
  }
  getAllFilter(filter: string): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/getallfilter/${filter}`, this.header)
  }
}
