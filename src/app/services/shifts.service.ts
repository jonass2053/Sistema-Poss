import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AlertServiceService } from '../Core/utilities/alert-service.service';
import { baseUrl } from '../Core/utilities/enviroment.';
import { ServiceResponse } from '../interfaces/service-response-login';
import { catchError, Observable } from 'rxjs';
import { Numberish } from 'primeng/ts-helpers';
import { iTurno } from '../interfaces/iTermino';
import { InformationService } from './information.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {

  url: string = `${baseUrl}/Turno`;

  public isOpen!: iTurno | undefined;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private alertas: AlertServiceService,
    private informartionService: InformationService
  ) { }
  userLocal: any | undefined;

  resetTurno() {
    let userLocal = localStorage.getItem('user');
    if (userLocal != undefined && userLocal != null) {
      this.userLocal = JSON.parse(userLocal);
      this.userLocal.data.idTurno = 0;
      localStorage.removeItem('user');
      localStorage.setItem('user', JSON.stringify(this.userLocal))
      this.informartionService.idTurno = 0;
    }
  }

  insert(formulario: any): any {
    return this.http.post<ServiceResponse>(`${this.url}`, formulario).pipe(catchError((error) => {
      console.log(error);
      this.alertas.errorAlert(error);
      return error()
    })
    )
  }
  update(formualrio: any): any {
    return this.http.put<ServiceResponse>(`${this.url}/close_turno`, formualrio).pipe(catchError((error) => {
      console.log(error);
      this.alertas.errorAlert(error);
      return error()
    })
    )
  }
  delete(id: number): Observable<ServiceResponse> {
    return this.http.delete<ServiceResponse>(`${this.url}/${id}`)
  }
  getAll(idSucursal: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/get_by_idsucursal/${idSucursal}`)
  }
  getById(idTurno: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/${idTurno}`)
  }
  getTurnoActual(idUsuario: number, idSucursal : number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/turno_actual${idUsuario}/${idSucursal}`)
  }

    getTurnoActualExeq() {
     this.getTurnoActual(this.informartionService.idUsuario, this.informartionService.idSucursal).subscribe((data: ServiceResponse) => {
      alert(this.informartionService.idUsuario);
      alert(this.informartionService.idSucursal);
      if (data.statusCode == 200) {
        this.isOpen = data.data == null ? undefined : data.data;
        let userLocal = localStorage.getItem('user');
        if (userLocal != undefined && userLocal != null) {
          this.userLocal = JSON.parse(userLocal);
          this.userLocal.data.idTurno = data.data.idTurno;
          localStorage.removeItem('user');
          localStorage.setItem('user', JSON.stringify(this.userLocal))
          this.informartionService.idTurno = data.data.idTurno;
        }
      }
    })
  }
  // getTurnoOpen(){
  //   this.alertas.ShowLoading();
  //   this.getById(this.informartionService.idTurno, this.informartionService.idUsuario).subscribe((data: ServiceResponse) => {
  //     if (data.statusCode == 200) {
  //       this.isOpen =data.data.isOpen==false? undefined :data.data;
  //       this.alertas.hideLoading();
  //     } else {
  //       this.alertas.hideLoading();
  //       this.isOpen=undefined;
  //     }
  //   })
  // }
}
