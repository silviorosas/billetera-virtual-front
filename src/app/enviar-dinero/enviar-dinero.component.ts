import { Component, TemplateRef } from '@angular/core';
import { ServiceService } from '../service.service';

import { CommonModule, DatePipe, NgClass, NgFor, NgIf, SlicePipe } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { TransaccionDTO } from '../TransaccionDTO';
import { TarjetaInfoDTO } from '../TarjetaInfoDTO';
import { Router } from '@angular/router';
import { EnvioDineroRequest } from '../envioDineroRequest';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { Tarjeta } from '../Tarjeta';
import { FormatearTarjetaPipe } from '../tarjeta.pipe';


interface UserCardInfoResponse {
  nombre: string;
  apellido: string;
  banco: string;
}



@Component({
  selector: 'app-enviar-dinero',
  standalone: true,  
  imports: [CommonModule,NgFor,DatePipe,SlicePipe,NgIf,NgClass,FormsModule,FormatearTarjetaPipe],
  templateUrl: './enviar-dinero.component.html',
  styleUrl: './enviar-dinero.component.css'
})
export class EnviarDineroComponent {

 
  mostrarTodasTransacciones: boolean = false;


  transacciones: TransaccionDTO[]=[];
 
  tarjetaInfo: TarjetaInfoDTO = {
    saldo: 0,
    id: 0,
    numeroTarjeta: '',
    banco: '',
    nombreUsuario: ''
  };



  errorMessage!: string;

  //para obtener el id y nombre user del jwt al hacer login
  userId!: number;
  userNombre!: string; 

  //para seleccionar tarjeta
  mostrarAgregarTarjeta = false;

  //para guardar lista de tarjetas
  tarjetaInfoByIdUser: Tarjeta[] =[]

//para mostrar una tarjeta activa
  tarjetaActiva: Tarjeta | null = null;
  tarjetaError!: null;

  seleccionarTarjeta(tarjeta: Tarjeta): void {
    this.tarjetaActiva = tarjeta;
    this.numeroTarjetaOrigenActiva = tarjeta.numeroTarjeta; // NUEVO
  }
  numeroTarjetaOrigenActiva: string = ''; // NUEVO para activar tarjeta en input numero tarjeta origen
  


  volverInicio() {
    this.mostrarAgregarTarjeta = false;
    this.tarjetaError = null;
  
  }

  navegarEnviarDinero(){
    this.router.navigateByUrl('/enviar-dinero');
    console.log("navegar a enviar dinero")
  }


  constructor(private service: ServiceService, private router: Router,private toastr: ToastrService
             ,private authService: AuthService  ) {      }

  ngOnInit(): void {
    this.getIdAndNombreByToken()    
   
    this.obtenerInfoTarjetaByIdUsuario();  
  
  }

  

  
  obtenerInfoTarjetaByIdUsuario(): void {
    this.service.obtenerInfoTarjetaByIdUser(this.userId)//id de la tarjeta
      .subscribe(
        response => {
          this.tarjetaInfoByIdUser = response;
          console.log('Información de la tarjeta by id usuario:', this.tarjetaInfoByIdUser);
        },
        error => {
          console.error('Error al obtener información de la tarjeta:', error);
        }
      );
  }



  getIdAndNombreByToken(){
    const token = this.authService.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userId = decodedToken.userId;
      console.log("userId:",this.userId)
      this.userNombre = decodedToken.userNombre;
      console.log("userNombre:",this.userNombre)
    }
    }







hideBalance = true;

  toggleVisibility() {
    this.hideBalance = !this.hideBalance;
  }

  hideText(texto: string): string {
    return texto.replace(/./g, '*');
  }




//*********Enviar dinero***********/

navegarInicio(){
  this.router.navigateByUrl('/');}


monto!: number;
mensaje!: string;
loading: boolean = false; // spinner

//para manejar errores del back
camposEnviarDineroError: string | null = null;
// Declarar una variable de bandera para verificar si se produjo un error
enviarDineroError: boolean | null = null;

// Metodo para validar datos antes de abrir el modal
validarDatosYMostrarModal(): void {
  if (!this.numeroTarjetaDestino ) {
    this.toastr.error('Por favor ingrese datos válidos.', 'Error', {
      positionClass: 'toast-center'
    });
    return;
  }
  
  const request: EnvioDineroRequest = {
    numeroTarjetaOrigen: this.numeroTarjetaOrigenActiva,
    numeroTarjetaDestino: this.numeroTarjetaDestino,
    monto: this.monto
  };

  // Enviamos la solicitud al backend para validar los datos
  this.service.validarDatos(request).subscribe(
    () => {
      // Si la validación es exitosa, abrimos el modal      
      this.abrirModal();
      this.loading = true; // spinner
      this.obtenerInfo()
      this.loading = false; // Esconder el spinner
    },
    (error) => {
      // Si hay un error en la validación, mostramos el mensaje de error del backend
      console.error('Error al validar datos:', error.error);
      this.toastr.error(error.error, 'Error', {
        positionClass: 'toast-center'
      });
      this.camposEnviarDineroError = error.error;
    }
  );
}

// Método para enviar el dinero después de la confirmación desde el modal

enviarDinero(): void {
  const isChecked = (document.getElementById('toggle') as HTMLInputElement).checked;
  if (isChecked) {
    this.loading = true; // Mostrar el spinner
    const request: EnvioDineroRequest = {      
      numeroTarjetaOrigen: this.numeroTarjetaOrigenActiva,
      numeroTarjetaDestino: this.numeroTarjetaDestino,
      monto: this.monto
    };

    this.service.enviarDinero(request).subscribe(
      (response: any) => {
        this.loading = false; // Esconder el spinner
        this.mensaje = response; // Mostrar mensaje de éxito
        this.toastr.success('Dinero enviado con éxito', 'Éxito', {
          positionClass: 'toast-center',
        });
        this.cerrarModal();
        this.actualizarSaldos();
       
      },
      (error) => {
        this.loading = false; // Esconder el spinner
        console.log('Error al enviar dinero:', error.error);
        this.toastr.error(error.error, 'Error', {
          positionClass: 'toast-center'
        });
        this.camposEnviarDineroError = error.error;
      }
    );
  }
}

actualizarSaldos(): void {
  // Iterar sobre las tarjetas y actualizar los saldos
  this.tarjetaInfoByIdUser.forEach(tarjeta => {
    if (tarjeta.numeroTarjeta === this.numeroTarjetaOrigenActiva) {
      // Restar el monto enviado al saldo de la tarjeta origen
      tarjeta.saldo -= this.monto;
    } else if (tarjeta.numeroTarjeta === this.numeroTarjetaDestino) {
      // Sumar el monto enviado al saldo de la tarjeta destino
      tarjeta.saldo += this.monto;
    }
  });
}


 // Método para abrir el modal
 abrirModal() { 
  // Obtener el modal
  const modal = document.getElementById('myModal');
  // Verificar si modal no es nulo
  if (modal) {
    // Mostrar el modal
    modal.style.display = 'block';
  }
}

// Método para cerrar el modal
cerrarModal() {
  // Obtener el modal
  const modal = document.getElementById('myModal');
  // Verificar si modal no es nulo
  if (modal) {
    // Ocultar el modal
    modal.style.display = 'none';
  }
   // Desmarcar el botón toggle switch al cerrar el modal
   (document.getElementById('toggle') as HTMLInputElement).checked = false;
}

//*********Obtener info de card por n° tarjeta*************
nombreUsuarioDestino: string ="";
numeroTarjetaDestino: string = '';

userCardInfo?: UserCardInfoResponse;

obtenerInfo(): void {
  this.service.obtenerInfoPorNumeroTarjeta(this.numeroTarjetaDestino).subscribe(
    (data: UserCardInfoResponse) => {
      this.userCardInfo = data;
      this.errorMessage = '';
      console.log("obtener info tarjeta por su número",this.userCardInfo)
    },
    (error) => {
      this.errorMessage = error.error;
      this.userCardInfo = undefined;
    }
  );
}





}
