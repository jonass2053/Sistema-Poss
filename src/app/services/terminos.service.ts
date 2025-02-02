import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ServiceResponse } from '../interfaces/service-response-login';
import { Observable, catchError } from 'rxjs';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { baseUrl } from '../Core/utilities/enviroment.';


@Injectable({
  providedIn: 'root'
})
export class TerminosService {
  url : string = `${baseUrl}/Terminos`;
  constructor(
      private http : HttpClient,
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
     getAll() : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}`)
     }
     
     setDefautlTermino(idTermino : number) : Observable<ServiceResponse>
     {
      return this.http.post<ServiceResponse>(`${this.url}/setdefault`, idTermino)
     }
}
