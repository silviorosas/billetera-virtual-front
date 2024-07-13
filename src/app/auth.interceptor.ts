import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem('authToken');
  const router = inject(Router); // Inyectar el Router

  // Validar que el token exista y tenga un formato razonable (por ejemplo, no esté vacío)
  if (token && typeof token === 'string' && token.trim() !== '') {
    const request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Manejar la expiración del token y acceso denegado
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  } else {
    // Manejar el caso donde el token no es válido (opcional)
    //console.error('Token no válido');
    // Podrías optar por no añadir el header si el token no es válido
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Manejar la expiración del token y acceso denegado
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
};