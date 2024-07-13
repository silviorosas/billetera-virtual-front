import { CommonModule, NgClass, NgFor, NgIf, SlicePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TarjetaInfoDTO } from '../TarjetaInfoDTO';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../models/loginDto';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,NgFor,SlicePipe,NgIf,NgClass,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent {
  

  loginDto: LoginDto = {
    email: '',
    password: ''
  };
  errorMessage: string | null = null;

  

  //para form login
  email!: string;
  password!: string;

  constructor(
    private service: ServiceService, 
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService,//no lo uso al igual que las class en models
    private toastr: ToastrService,
     ) { }
  
  ngOnInit(): void {
    
 
  }

  onLogin(): void {
    console.log("Login DTO antes de enviar:", this.loginDto); // Agrega este log para depurar
    this.authService.login(this.loginDto).subscribe(
      response => {
        this.toastr.success('Login exitoso!!', 'Éxito', {
          positionClass: 'toast-top-center',
        });
        console.log('Inicio de sesión exitoso:', response);
        this.tokenService.setToken(response.responseMessage);
        this.router.navigate(['/']);
      },
      error => {
        this.toastr.error(error.error, 'Error', {
          positionClass: 'toast-top-center'
        });
        this.errorMessage = 'Login failed: ' + (error.error || error.message);
        console.error('Login error:', error);
      }
    );
  }

  navegarInicio(){
    this.router.navigateByUrl('/register');
  }


  

}
