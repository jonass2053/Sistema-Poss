import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { baseUrl } from '../Core/utilities/enviroment.';
import { ServiceResponse } from '../interfaces/service-response-login';
import { catchError, Observable } from 'rxjs';
import { Numberish } from 'primeng/ts-helpers';

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {

  url: string = `${baseUrl}/Turno`;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private alertas: AlertServiceService
  ) { }



  insert(formulario: any): any {
    return this.http.post<ServiceResponse>(`${this.url}`, formulario).pipe(catchError((error) => {
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
  getAll(idSucursal : number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/get_by_idsucursal/${idSucursal}`)
  }
}
