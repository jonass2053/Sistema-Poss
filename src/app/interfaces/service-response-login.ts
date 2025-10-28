import { iModulo } from "./iTermino"

export interface ServiceResponse {
    dateNow: Date,
    totalFacturado: number,
    totalMontoPagado: number
    totalMontoPorPagar: number
    totalMontoVencido: number
    message: string,
    token: string,
    status: string,
    statusCode: number,
    currentPage: number,
    cantPage: number,
    totalItems: number,
    data: any
    cantEntradas : number,
    cantSalidas : number,
    cantProd : number,
    montoTotalInventario : number
}

export interface ServiceResponseLogin {
    message: string,
    token: string,
    status: boolean,
    data: any
}

export interface iRol {
    idRol?: number,
    nombre: string,
    descripcion : string,
    modulos : iModulo[]
}