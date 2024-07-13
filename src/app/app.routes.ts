import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QrDecoderComponent } from './qr-decoder/qr-decoder.component';
import { EnviarDineroComponent } from './enviar-dinero/enviar-dinero.component';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },  // Redirige la ruta raíz a 'home'
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'enviar-dinero', component: EnviarDineroComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'qr', component: QrDecoderComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' } // Ruta comodín redirige a home
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }