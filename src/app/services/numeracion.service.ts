import { Injectable } from '@angular/core';
import { ServiceResponse } from '../interfaces/service-response-login';
import { Observable, catchError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { iEstado } from '../interfaces/iTermino';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { baseUrl } from '../Core/utilities/enviroment.';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class NumeracionService {
  private headers: HttpHeaders;
  private header: { headers: HttpHeaders }
  url: string = `${baseUrl}/Numeracion`;
  constructor(
    private http: HttpClient,
    private alertas: AlertServiceService,
    private usuarioService: UsuarioService
  ) {

    this.headers = new HttpHeaders({ 'Authorization': `Bearer ${usuarioService.usuarioLogueado.token}` });
    this.header = { headers: this.headers };
  }


  insert(formulario: any): any {
    return this.http.post<ServiceResponse>(`${this.url}`, formulario).pipe(catchError((error) => {
      console.log(error);
      this.alertas.errorAlert(error);
      return error()
    })
    )
  }
  update(formulario: any): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.url}`, formulario, this.header)
  }
  updateStatus(id: number, estado: boolean): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.url}/updateestado`, { 'id': id, 'estado': estado })
  }
  delete(id: number): Observable<ServiceResponse> {
    return this.http.delete<ServiceResponse>(`${this.url}/${id}`, this.header)
  }
  getAll(): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}`, this.header)
  }
  getAllTipoDocumentos(): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/get-tipo-documentos`, this.header)
  }
  getTipoNumeracion(id: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/get-tipo-nuemracion/${id}`, this.header)
  }

  setDefautlNumeration(idNumeracion: number): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(`${this.url}/setdefault`, idNumeracion, this.header)
  }
}
