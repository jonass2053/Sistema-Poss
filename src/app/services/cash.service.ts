import { Injectable } from '@angular/core';
import { baseUrl } from '../Core/utilities/enviroment.';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { ServiceResponse } from '../interfaces/service-response-login';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CashService {


  url: string = `${baseUrl}/Cash`;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private alertas: AlertServiceService
  ) { }



  insert(formualrio: any): any {
    return this.http.post<ServiceResponse>(`${this.url}`, formualrio).pipe(catchError((error) => {
      console.log(error);
      this.alertas.errorAlert(error);
      return error()
    })
    )
  }

  getById(id: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/${id}`)
  }
  update(formualrio: any): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.url}`, formualrio)
  }
  delete(id: number): Observable<ServiceResponse> {
    return this.http.delete<ServiceResponse>(`${this.url}/${id}`)
  }
  getAll(idSucursal: number, idTurno: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/get_by_idsucursal/${idSucursal}/${idTurno}`)
  }
  getResumen(idTurno: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/getResumen/${idTurno}`)
  }

}


