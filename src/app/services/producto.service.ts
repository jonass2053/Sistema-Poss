import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceResponse } from '../interfaces/service-response-login';
import { Observable, catchError } from 'rxjs';
import { iImpuestoProductoCodigo, iProducto } from '../interfaces/iTermino';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { baseUrl } from '../Core/utilities/enviroment.';
import { UsuarioService } from './usuario.service';
import { InformationService } from './information.service';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private headers: HttpHeaders;
  private header: { headers: HttpHeaders }
  url: string = `${baseUrl}/Producto`;
  constructor(
    private http: HttpClient,
    private alertas: AlertServiceService,
    private usuarioService: UsuarioService,
    private informatinService : InformationService
  ) {
    this.headers = new HttpHeaders({ 'Authorization': `Bearer ${usuarioService.usuarioLogueado.token}` });
    this.header = { headers: this.headers };
  }



  productoForEdit!: iProducto;

  insert(formualrio: any): any {
    return this.http.post<ServiceResponse>(`${this.url}`, formualrio, this.header).pipe(
      catchError((error) => {
        this.alertas.errorAlert(error.error.message);
        return error()
      })
    )
  }

  update(formualrio: any): any {
    return this.http.put<ServiceResponse>(`${this.url}`, formualrio, this.header).pipe(
      catchError((error) => {
        console.log(error)
        this.alertas.errorAlert(error.error.message);
        return error()
      })
    )
  }
  delete(id: number): Observable<ServiceResponse> {
    return this.http.delete<ServiceResponse>(`${this.url}/${id}`, this.header)
  }
  getById(id: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/${id}`, this.header)
  }
  getAll(idEmpresa: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/get_all/${idEmpresa}/1/100`, this.header)
  }
  getAllUnidades(): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/getunidades`, this.header)
  }
  getAllUnidadesFilter(filter: string): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/getunidades/${filter}`, this.header)
  }
  getAllCuentas(): Observable<ServiceResponse> {

    return this.http.get<ServiceResponse>(`${this.url}/getcuentas`, this.header)
  }
  getAllCategorias(): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${baseUrl}/Categoria/getCategorias/${this.informatinService.idEmpresa}`, this.header)
  }
  getAllMarcas(idCategoria: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${baseUrl}/Categoria`, this.header)
  }

  getAllModelos(idMarca: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${baseUrl}/Categoria`, this.header)
  }

  insertImpuestos(impuestos: iImpuestoProductoCodigo[]): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(`${this.url}/addimpuestos`, impuestos, this.header)
  }
  getAllFilter(valor: string, idSucursal : number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/filter/${valor}/${idSucursal}`, this.header)
  }
  getAllFilterForDocument(valor: string,  idSucursal : number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/filter-for-document/${valor}/${idSucursal}`, this.header)
  }

  insertAjusteInventario(formulario: any): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(`${this.url}/ajuste_inventario`, formulario, this.header)
  }

  updateAjusteInventario(formulario: any): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.url}/ajuste_inventario`, formulario, this.header)
  }

  deleteAjusteInventario(idAjuste: number): Observable<ServiceResponse> {
    return this.http.delete<ServiceResponse>(`${this.url}/ajuste_inventario?id=${idAjuste}`, this.header)
  }

  GetAjusteInventario(pageNumber: number, pageSize: number, idSucursal: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/ajuste_inventario/${pageNumber}/${pageSize}/${idSucursal}`, this.header)
  }

  GetAllMovimientoProductos(pageNumber: number, pageSize: number, idSucursal: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/movimientos/${pageNumber}/${pageSize}/${idSucursal}`, this.header)
  }

  getAllFilterMovimientos(valor: string,  idSucursal : number, desde?: Date, hasta?: Date): Observable<ServiceResponse> {
    if (desde != null)
      return this.http.get<ServiceResponse>(`${this.url}/filter_movimientos/${valor}/${idSucursal}?desde=${desde}&hasta=${hasta}`, this.header)
    return this.http.get<ServiceResponse>(`${this.url}/filter_movimientos/${valor}/${idSucursal}`, this.header)
  }

  getAllFilterAjustes(valor: string, idSucursal : number, desde?: Date, hasta? : Date): Observable<ServiceResponse> {
    if (desde != null)
      return this.http.get<ServiceResponse>(`${this.url}/filter_ajustes/${valor}/${idSucursal}?desde=${desde}&hasta=${hasta}`, this.header)
    return this.http.get<ServiceResponse>(`${this.url}/filter_ajustes/${valor}/${idSucursal}`, this.header)
  }

  generateBarCode(idProducto: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/generate_barcode?idProducto=${idProducto}`, this.header)
  }
  getProductosByIdCategoria(idCategoria: number, idEmpresa: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/getbyidcategoria/${idCategoria}/${idEmpresa}`, this.header)
  }



}
