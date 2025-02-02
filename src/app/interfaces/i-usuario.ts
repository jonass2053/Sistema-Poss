import { iRol } from "./service-response-login"

export interface IUsuario {

    idUsuario? : number,
    nombre : string,
    apellidos : string,
    correo : string,
    idRol : number,
    estado : boolean,
    contrasena : string,
    rol : iRol
}
