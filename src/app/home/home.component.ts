import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { TarjetaInfoDTO } from '../TarjetaInfoDTO';
import { TransaccionDTO } from '../TransaccionDTO';
import { DatePipe, NgClass, NgFor, NgIf, SlicePipe } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { TarjetaRequest } from '../addTarjeta';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { Tarjeta } from '../Tarjeta';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor,DatePipe,SlicePipe,NgIf,NgClass,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  mostrarTodasTransacciones: boolean = false;


  transacciones: TransaccionDTO[]=[];
 
  tarjetaInfo: TarjetaInfoDTO = {
    saldo: 0,
    id: 0,
    numeroTarjeta: '',
    banco: '',
    nombreUsuario: ''
  };
 

  agregarTarjetaMode: boolean = false;

  //para obtener el id y nombre user del jwt al hacer login
  userId!: number;
  userNombre!: string;

  //para guardar lista de tarjetas
  tarjetaInfoByIdUser: Tarjeta[] =[]

//para mostrar una tarjeta activa
  tarjetaActiva: Tarjeta | null = null;

 
  
    
   

  constructor(private service: ServiceService, private router: Router,private authService: AuthService) { }

  ngOnInit(): void {    

    this.getIdAndNombreByToken()
    this.obtenerTransaccionesPorUsuarioId(this.userId);
    this.obtenerInfoTarjetaByIdUsuario();
  
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

//*****Obtener historial de transaciones******/
obtenerTransaccionesPorUsuarioId(usuarioId: number): void {
  this.service.obtenerTransaccionesPorUsuarioId(usuarioId)
    .subscribe(transacciones => {
      const seenTransactions = new Set<number>(); // Para rastrear transacciones únicas

      this.transacciones = transacciones
        .map(transaccion => {
          let nombreMostrar = transaccion.tipoTransaccion === 'Dinero enviado' 
            ? transaccion.nombreUsuarioDestino 
            : transaccion.nombreUsuarioOrigen;
          
          // Si ambos nombres son null, establecer como "Crédito de Haberes"
          if (!transaccion.nombreUsuarioOrigen && !transaccion.nombreUsuarioDestino) {
            nombreMostrar = 'Crédito de Haberes';
          }

          return {
            ...transaccion,
            nombreMostrar
          };
        })
        .filter(transaccion => {
          // Filtrar transacciones duplicadas (mismo ID)
          if (seenTransactions.has(transaccion.id)) {
            return false;
          } else {
            seenTransactions.add(transaccion.id);
            return true;
          }
        })
        .sort((a, b) => {
          // Ordenar primero por fecha de manera descendente
          const dateComparison = new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
          if (dateComparison !== 0) {
            return dateComparison;
          }
          // Si las fechas son iguales, ordenar por el ID de la transacción
          return b.id - a.id;
        });

      console.log("Transacciones: ", this.transacciones);
    });
}


  
  verMas() {
    this.mostrarTodasTransacciones = true;
}

hideBalance = true;

  toggleVisibility() {
    this.hideBalance = !this.hideBalance;
  }

  hideText(texto: string): string {
    return texto.replace(/./g, '*');
  }

 


//*****Agregar tarjeta******//
//*****Agregar tarjeta******//
numeroTarjeta: string = '';
banco: string = '';

mostrarAgregarTarjeta = false;
  
toggleTarjeta(): void {
  this.mostrarAgregarTarjeta = !this.mostrarAgregarTarjeta;
}

seleccionarTarjeta(tarjeta: Tarjeta): void {
  this.tarjetaActiva = tarjeta;
}

//para manejar errores del back
camposTarjetaError: string | null = null;
// Declarar una variable de bandera para verificar si se produjo un error
tarjetaError: boolean | null = null;

agregarTarjeta(usuarioId: number): void {
  const nuevaTarjeta: TarjetaRequest = {
      numeroTarjeta: this.numeroTarjeta,
      banco: this.banco
  };

  this.service.agregarTarjeta(usuarioId, nuevaTarjeta).subscribe(
    (tarjeta: Tarjeta) => {
      console.log('Tarjeta agregada:', tarjeta);
      

      // Verifica si tarjetaInfoByIdUser es un arreglo antes de actualizarlo
      if (Array.isArray(this.tarjetaInfoByIdUser)) { // Nuevo
        this.tarjetaInfoByIdUser.push(tarjeta); // Nuevo
      } else { // Nuevo
        this.tarjetaInfoByIdUser = [tarjeta]; // Nuevo
      } // Nuevo
      this.tarjetaError = false;
      // Restablecer el formulario
      this.numeroTarjeta = ''; // Nuevo
      this.banco = ''; // Nuevo

       // Mostrar el mensaje de éxito por un corto tiempo antes de volver a la lista de tarjetas
       setTimeout(() => {
        this.mostrarAgregarTarjeta = false;
      }, 2000); // 2000 milisegundos = 2 segundos
    },
    (error) => {
      console.error('Error al agregar tarjeta:', error);
      this.camposTarjetaError = error.error; // mensaje de error que viene desde el back
      console.log(this.camposTarjetaError);
      this.tarjetaError = true;
    }
  );
}



volverInicio() {
  this.mostrarAgregarTarjeta = false;
  this.tarjetaError = null;

}


navegarEnviarDinero(){
  this.router.navigateByUrl('/enviar-dinero');
  console.log("navegar a enviar dinero")
}


 


}
