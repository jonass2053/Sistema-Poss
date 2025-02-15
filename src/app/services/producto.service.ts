import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceResponse } from '../interfaces/service-response-login';
import { Observable, catchError } from 'rxjs';
import { iImpuestoProductoCodigo, iProducto } from '../interfaces/iTermino';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { baseUrl } from '../Core/utilities/enviroment.';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  url : string = `${baseUrl}/Producto`;
  constructor(
      private http : HttpClient,
      private alertas : AlertServiceService
     ) { }
   
  

     productoForEdit! : iProducto;

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
     getById(id : number) : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/${id}`)
     }
     getAll(idEmpresa : number) : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/get_all/${idEmpresa}`)
     }
     getAllUnidades() : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/getunidades`)
     }
     getAllUnidadesFilter(filter : string) : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/getunidades/${filter}`)
     }
     getAllCuentas() : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/getcuentas`)
     }
     getAllCategorias() : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${baseUrl}/Categoria`)
     }
     getAllMarcas(idCategoria : number) : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${baseUrl}/Categoria`)
     }

     getAllModelos(idMarca : number) : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${baseUrl}/Categoria`)
     }
     
     insertImpuestos(impuestos : iImpuestoProductoCodigo[]) : Observable<ServiceResponse>
     {
      return this.http.post<ServiceResponse>(`${this.url}/addimpuestos`, impuestos)
     }
     getAllFilter(valor : string) : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/filter/${valor}`)
     }
     getAllFilterForDocument(valor : string) : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/filter-for-document/${valor}`)
     }
   
}
