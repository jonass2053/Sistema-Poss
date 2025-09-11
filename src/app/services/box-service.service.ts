import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../Core/utilities/enviroment.';
import { FormBuilder } from '@angular/forms';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { UsuarioService } from './usuario.service';
import { ServiceResponse } from '../interfaces/service-response-login';
import { catchError, Observable, throwError } from 'rxjs';
import { InformationService } from './information.service';
import { iCaja } from '../interfaces/iTermino';

@Injectable({
  providedIn: 'root'
})
export class BoxServiceService {

  url: string = `${baseUrl}/Caja`;
  cajaEdit!: iCaja | any;

  private headers: HttpHeaders;
  private header: { headers: HttpHeaders }
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private alertas: AlertServiceService,
    private usuarioService: UsuarioService,
    private informationService: InformationService
  ) {

    this.headers = new HttpHeaders({ 'Authorization': `Bearer ${usuarioService.usuarioLogueado.token}` });
    this.header = { headers: this.headers };
  }

  insert(formulario: any): any {
    return this.http.post<ServiceResponse>(`${this.url}`, formulario, this.header).pipe(
      catchError((error) => {
        // Aquí puedes hacer un manejo personalizado o solo propagar el error
        return throwError(() => error);
      })
    );
  }
  update(formualrio: any): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.url}`, formualrio, this.header)
  }
  delete(id: number): Observable<ServiceResponse> {
    return this.http.delete<ServiceResponse>(`${this.url}/${id}`, this.header)
  }
  getAll(): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/by_id_sucursal/${this.informationService.idSucursal}`, this.header)
  }

  getAllCajasDisponibles(): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/disponible/by_id_sucursal/${this.informationService.idSucursal}`, this.header)
  }


   reporteConsolidado(idSucursal  : number, desde: any, hasta: any): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/report_consolidado/${idSucursal}/${desde}/${hasta}`, this.header)
  }
 
 reporteConsolidadoExportar(idSucursal  : number, desde: any, hasta: any): Observable<Blob> {
    return this.http.get(`${this.url}/report_consolidado_exportar/${idSucursal}/${desde}/${hasta}`, {
      ...this.header,    // <-- esto inyecta las cabeceras correctamente
      responseType: 'blob'
    });
  }

}
