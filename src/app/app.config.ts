import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { authInterceptor } from './auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [  
    importProvidersFrom(
      ModalModule.forRoot()
        ),
    provideAnimations(),
    provideToastr(),   
    provideNoopAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),provideHttpClient()
  ]
};
