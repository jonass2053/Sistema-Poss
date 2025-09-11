import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ServiceResponse, ServiceResponseLogin } from '../interfaces/service-response-login';

import { HandleErrorService } from './handle-error.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { baseUrl } from '../Core/utilities/enviroment.';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private http: HttpClient,
    private error: HandleErrorService,
    private alertas: AlertServiceService,
    private router: Router) {

  }

  token: any;
  usuarioLogueado: any;
  login(credenciales: any): any {
    return this.http.post<ServiceResponseLogin>(`${baseUrl}/User/login`, credenciales).pipe(catchError((error) => {
      if (error != undefined) {
        this.alertas.errorAlert(`${error.error.message}`);
      } else {
        this.alertas.errorAlert('Lo sentimos, no pudimos procesar tu solicitud en este momento. Por favor, inténtalo de nuevo más tarde o ponte en contacto con el soporte técnico para obtener ayuda. Código de error: 500 Internal Server Error')
      }
      let e: HttpErrorResponse = error;
      return error;
    }));
  }

  url: string = `${baseUrl}/User`;

  chekSesion(statusCode: number) {
    if (statusCode == 401 || statusCode == 0) {
      this.alertas.warnigAlert("La sesión a caducado.");
      localStorage.clear();
      setTimeout(() => {
        this.router.navigate(['']);
      }, 2000);

    }
  }
  insert(formualrio: any): any {
    return this.http.post<ServiceResponse>(`${this.url}`, formualrio).pipe(catchError((error) => {
      console.log(error);
      this.alertas.errorAlert(error);
      return error()
    })
    )
  }
  update(formualrio: any): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.url}`, formualrio)
  }
  delete(id: number): Observable<ServiceResponse> {
    return this.http.delete<ServiceResponse>(`${this.url}/${id}`)
  }
  getAll(): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}`)
  }


}
