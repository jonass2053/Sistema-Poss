import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ServiceResponse } from '../interfaces/service-response-login';
import { catchError, Observable } from 'rxjs';
import { baseUrl } from '../Core/utilities/enviroment.';
import { AlertServiceService } from '../Core/utilities/alert-service.service';


@Injectable({
  providedIn: 'root'
})
export class BancosService {

  url : string = `${baseUrl}/Banco`;
  constructor(
      private http : HttpClient,
      private fb : FormBuilder,
      private alertas : AlertServiceService
     ) { }
   
     
  
     insert(formualrio : any) : any
     {
        return this.http.post<ServiceResponse>(`${this.url}`, formualrio).pipe(catchError((error)=>
        {
          console.log(error);
          this.alertas.errorAlert(error);
          return error()
        })
         )
     }
     update(formualrio : any) : Observable<ServiceResponse>
     {
      return this.http.put<ServiceResponse>(`${this.url}`, formualrio)
     }
     delete(id : number) : Observable<ServiceResponse>
     {
      return this.http.delete<ServiceResponse>(`${this.url}/${id}`)
     }
     getAll(idSucursal : number) : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/getAll/${idSucursal}`)
     }
     getTipoCuenta() : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/get_tipo_cuenta_banck`)
     }
}
