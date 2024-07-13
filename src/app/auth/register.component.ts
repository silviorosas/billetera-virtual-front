import { Component } from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf, SlicePipe } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { TarjetaInfoDTO } from '../TarjetaInfoDTO';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../models/loginDto';
import { Register } from '../models/register';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,NgFor,SlicePipe,NgIf,NgClass,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  

  registerDto: Register = {
    nombre:'',
     apellido:'',
    email: '',
    password: ''
  };

  errorMessage: string | null = null;
  

  //para form register
  nombre!:string;
  apellido!:string;
  email!: string;
  password!: string;

  constructor(
    private service: ServiceService, 
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private tokenService: TokenService,//no lo uso al igual que las class en models
  
     ) { }
  
  ngOnInit(): void {   
 
  }

  register(): void {
    console.log("Registro antes de enviar:", this.registerDto); // Agrega este log para depurar
    if (this.registerDto.nombre && this.registerDto.apellido && this.registerDto.email && this.registerDto.password) {      
    this.authService.register(this.registerDto).subscribe(
      response => {
        console.log('Registro exitoso:', response);
        this.toastr.success('Registro exitoso!!', 'Éxito', {
          positionClass: 'toast-top-center',
        });
        this.router.navigate(['/login']);
      },
      error => {
        this.errorMessage = 'Register failed: ' + (error.error || error.message);
        console.error('register error:', error);
        console.log('Registro error:', error.error);
        this.toastr.error(error.error, 'Error', {
          positionClass: 'toast-top-center'
        });
      }
    );
  }
  }

  navegarInicio(){
    this.router.navigateByUrl('/login');
  }


 

}
