import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServiceResponse } from '../interfaces/service-response-login';
import { iPago } from '../interfaces/iTermino';
import { UsuarioService } from './usuario.service';
import { Observable } from 'rxjs';
import { baseUrl } from '../Core/utilities/enviroment.';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  facturaEdit!: any;
  pagosFactura: iPago[] = [];
  url: string = `${baseUrl}/Factura`;
  document: string = "Cotización";
  private headers: HttpHeaders;
  private header: { headers: HttpHeaders }
  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService) {
    this.headers = new HttpHeaders({ 'Authorization': `Bearer ${usuarioService.usuarioLogueado.token}` });
    this.header = { headers: this.headers };
  }

  tipoDocument = () => {
    console.log(localStorage.getItem('tipoDocumento'));
  }


  insert(formualrio: any): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(`${this.url}`, formualrio, this.header)
  }
  update(formualrio: any): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.url}`, formualrio, this.header)
  }
  delete(id: number): Observable<ServiceResponse> {
    return this.http.delete<ServiceResponse>(`${this.url}/${id}`, this.header)
  }
  getAll(idSucursal: number, pageNumber: number, pageSize: number, tipoDocument: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/getallpaginations/${idSucursal}/${pageNumber}/${pageSize}/${tipoDocument}`, this.header)
  }
  getAllFacturasPendientes(idSucursal: number, idCliente: number, pageNumber: number, pageSize: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/getallFacturasPendientesByIdCliente/${idSucursal}/${idCliente}/${pageNumber}/${pageSize}`, this.header)
  }
  getById(idFactura: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/getbyid/${idFactura}`, this.header)
  }
  getAllMetodoPago(): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/get_all_metodopago`, this.header)
  }
  getResumenFacturas(idSucursal: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/getresumenventasbyidsucursal/${idSucursal}`, this.header)
  }

  getAllFilter(idEmpresa: number, filter: string, idTipoDocumento: number, pageNumber: number, pageSize: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/getallfilter/${filter}/${idEmpresa}/${idTipoDocumento}/${pageNumber}/${pageSize}`, this.header)
  }
}
