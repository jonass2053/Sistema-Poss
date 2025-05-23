 import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, catchError } from 'rxjs';
import { ServiceResponse } from '../interfaces/service-response-login';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { baseUrl } from '../Core/utilities/enviroment.';


@Injectable({
  providedIn: 'root'
})
export class RolesService {

// private headers : HttpHeaders;
// private header : { headers : HttpHeaders }
//this.headers =  new HttpHeaders({'Authotization' : `Bearer${}`})
url : string = `${baseUrl}/Turno/`;
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
   getAll() : Observable<ServiceResponse>
   {
    return this.http.get<ServiceResponse>(`${this.url}`)
   }

}
