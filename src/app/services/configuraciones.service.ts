import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ServiceResponse } from '../interfaces/service-response-login';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { baseUrl } from '../Core/utilities/enviroment.';
;

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionesFactService {

  url: string = `${baseUrl}/Configuracion`;
  constructor(
    private http: HttpClient,
    private alertas: AlertServiceService
  ) { }


  getAll(): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}`)
  }

   saveChange(formulario : any): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.url}`,formulario)
  }
}
