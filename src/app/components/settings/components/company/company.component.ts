import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertServiceService } from 'src/app/Core/utilities/alert-service.service';
import { importaciones } from 'src/app/Core/utilities/material/material';
import { ValidatorFormService } from 'src/app/Core/utilities/validator-form.service';
import { iMoneda, iNumEmpleados, iRegimen, iSector } from 'src/app/interfaces/iTermino';
import { ServiceResponse } from 'src/app/interfaces/service-response-login';
import { EmpresaService } from 'src/app/services/empresa.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent {
  constructor(
    private fb : FormBuilder,
     private validatorForm : ValidatorFormService,
     private alertasService:  AlertServiceService,
     private empresaService : EmpresaService,
     private usuariosService: UsuarioService 
    ){
      this.cargarSector();
      this.cargarRegimen();
      this.cargarEmpresaById();
      this.cargarMonedas();
    }
    numEmpleadosData : iNumEmpleados[]=[
      {value : '1 a 10', name: '1 a 10'},
      {value : '11 a 50', name: '11 a 50'},
      {value : '51 a 100', name: '51 a 100'},
      {value : '101 a 200', name: '101 a 200'},
      {value : 'Más de 200', name: 'Más de 200'},
    ];
    
    

    dataListSector : iSector[]=[];
    dataLisRegimen : iRegimen[]=[];
    dataListMonedas : iMoneda[]=[];

    
  miFormulario : FormGroup = this.fb.group(
    {
      idEmpresa :  this.fb.control(null),
      razonSocial : this.fb.control("", Validators.required),
      nombreComercial : this.fb.control("", Validators.required),
      rnc : this.fb.control("", Validators.required),
      telefono1 : this.fb.control(""),
      telefono2 : this.fb.control(""),
      direccion : this.fb.control(""),
      correo : this.fb.control(""),
      web : this.fb.control("",),
      idRegimen : this.fb.control(null),
      idSector :  this.fb.control(null),
      idMoneda :  this.fb.control("", Validators.required),
      facturacionElectronica : this.fb.control(false),
      cantEmpleados : this.fb.control("")

    }
  )
  validar(campo: string){return this.validatorForm.validar(this.miFormulario, campo);}
  selectedFile: File | undefined;
  imageUrl: string | ArrayBuffer | null = null;
  formData =  new FormData();
  moneda! : iMoneda;
  subtotalGeneral : number =0;
  descuentoGeneral : number =0;
  totalGeneral : number =0;
  uploadFile(file : File)
  {
    this.formData.append('file',file);
  
  }
  onFileSelected(event: any) {
    this.formData.append('logo',(event.target.files[0] as File))
    this.selectedFile = event.target.files[0] as File;
    this.previewImage();
  }
  previewImage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
    }
  }
  insert(event : any)
  { 
     this.formData.append('idEmpresa', this.miFormulario.get('idEmpresa')?.value)   
     this.formData.append('razonSocial', this.miFormulario.get('razonSocial')?.value);
     this.formData.append('nombreComercial', this.miFormulario.get('nombreComercial')?.value);
     this.formData.append('direccion', this.miFormulario.get('direccion')?.value);
     this.formData.append('telefono1', this.miFormulario.get('telefono1')?.value);
     this.formData.append('telefono2', this.miFormulario.get('telefono2')?.value);
     this.formData.append('correo', this.miFormulario.get('correo')?.value);
     this.formData.append('rnc', this.miFormulario.get('rnc')?.value);
     this.formData.append('web', this.miFormulario.get('web')?.value);
     this.formData.append('idRegimen', this.miFormulario.get('idRegimen')?.value);
     this.formData.append('idSector', this.miFormulario.get('idSector')?.value);
     this.formData.append('idMoneda', this.miFormulario.get('idMoneda')?.value);
     this.formData.append('cantEmpleados', this.miFormulario.get('cantEmpleados')?.value);
     this.formData.forEach(c=>{console.log(c)});
    
     this.alertasService.ShowLoading();
     this.empresaService.update(this.formData).subscribe((response: ServiceResponse)=>{
      console.log(response)
      this.alertasService.hideLoading();
     })
      
    }
  

  cargarRegimen()
  {
    this.empresaService.getAllRegimen().subscribe((response : ServiceResponse)=>
    {
      response.data!=null? this.dataLisRegimen = response.data : ""
    })
  }

  cargarSector()
  {
    this.empresaService.getAllSectores().subscribe((response : ServiceResponse)=>
    {
      response.data!=null? this.dataListSector = response.data : ""
    })
  }
  cargarMonedas()
  {
    this.empresaService.getAllMonedas().subscribe((response : ServiceResponse)=>
    {
      response.data!=null? this.dataListMonedas = response.data : ""
    })
  }

  cargarEmpresaById()
  {
    if(this.usuariosService.usuarioLogueado!=undefined)
      {
        this.empresaService.getById(this.usuariosService.usuarioLogueado.data.sucursal.idEmpresa).subscribe((response: ServiceResponse)=>
          {
            console.log(response)
            this.miFormulario.reset(response.data)
            this.imageUrl = response.data.logo;
            this.miFormulario.patchValue(
              {
                'telefono1' : response.data.sucursalPrincipal.telefono1,
                'telefono2' : response.data.sucursalPrincipal.telefono2,
                'direccion' : response.data.sucursalPrincipal.direccion,

              },
             
            
            )
       
          })
      }
   
  }
}
