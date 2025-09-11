import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServiceResponse } from '../interfaces/service-response-login';
import { Observable, catchError } from 'rxjs';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { baseUrl } from '../Core/utilities/enviroment.';
import { UsuarioService } from './usuario.service';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private headers!: HttpHeaders;
  private header!: { headers: HttpHeaders }
  url: string = `${baseUrl}/Empresa`;
  constructor(
    private http: HttpClient,
    private alertas: AlertServiceService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {

    if (this.router.url !== '/login' && this.router.url !== '/') {
      this.headers = new HttpHeaders({ 'Authorization': `Bearer ${usuarioService.usuarioLogueado.token}` });
      this.header = { headers: this.headers };
    }

  }


  insert(formulario: any): any {
    return this.http.post<ServiceResponse>(`${this.url}`, formulario, this.header).pipe(catchError((error) => {
      console.log(error);
      this.alertas.errorAlert(error);
      return error()
    })
    )
  }
  createAccount(formulario: any): any {
    return this.http.post<ServiceResponse>(`${this.url}/create_acount`, formulario, this.header).pipe(catchError((error) => {
      console.log(error);
      this.alertas.errorAlert(error.error.message);
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
  getById(id: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/${id}`, this.header)
  }
  getAll(): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}`, this.header)
  }
  getAllRegimen(): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/getall-regimen`, this.header)
  }
  getAllSectores(): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/getall-sectores`, this.header)
  }
  getAllMonedas(): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/getall-monedas`, this.header)
  }
}
