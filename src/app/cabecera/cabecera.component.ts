import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-cabecera',
  standalone: true,
  imports: [],
  templateUrl: './cabecera.component.html',
  styleUrl: './cabecera.component.css'
})
export class CabeceraComponent {

   //para obtener el id y nombre user del jwt al hacer login
   userId!: number;
   userNombre!: string;


   constructor(private authService: AuthService) { }

   ngOnInit(): void {    
     this.getIdAndNombreByToken()  
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


}
