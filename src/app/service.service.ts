import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { TarjetaInfoDTO } from './TarjetaInfoDTO';
import { TransaccionDTO } from './TransaccionDTO';
import { TarjetaRequest } from './addTarjeta';
import { HttpHeaders } from '@angular/common/http';
import { EnvioDineroRequest } from './envioDineroRequest';
import { ActiveToast, ToastrService } from 'ngx-toastr';
import { Tarjeta } from './Tarjeta';



interface UserCardInfoResponse {
  nombre: string;
  apellido: string;
  banco: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private baseUrl = 'http://localhost:8080/api';

  private apiUrl = 'http://localhost:8080/api/tarjeta';

  private url = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient,private toastr: ToastrService) { }

  

  obtenerInfoTarjeta(id: number): Observable<TarjetaInfoDTO> {
    const url = `${this.baseUrl}/tarjeta/${id}`;
    return this.http.get<TarjetaInfoDTO>(url);
  }

  obtenerInfoTarjetaByIdUser(id: number): Observable<Tarjeta[]> {
    const url = `${this.url}/${id}/tarjetas`;
    return this.http.get<Tarjeta[]>(url);
  }

 
  obtenerTransaccionesPorUsuarioId(usuarioId: number): Observable<TransaccionDTO[]> {
    return this.http.get<TransaccionDTO[]>(`${this.baseUrl}/usuario2/${usuarioId}`);
  }

  agregarTarjeta(usuarioId: number, tarjeta: TarjetaRequest): Observable<any> {
    const url = `${this.apiUrl}/usuario/${usuarioId}`;
    return this.http.post<any>(url, tarjeta);
  }

  
  enviarDinero(request: EnvioDineroRequest): Observable<any> {
    const url = `${this.baseUrl}/enviar-dinero`;
    return this.http.post<any>(url, request);
  }

  validarDatos(request: EnvioDineroRequest): Observable<TransaccionDTO> {
    const url = `${this.baseUrl}/validar-datos`;
    return this.http.post<TransaccionDTO>(url, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<any> {
    //console.error('Error en la solicitud:', error.error);
    throw error;
  }

  

  obtenerInfoPorNumeroTarjeta(numeroTarjeta: string): Observable<UserCardInfoResponse> {
    return this.http.get<UserCardInfoResponse>(`${this.baseUrl}/info-tarjeta/${numeroTarjeta}`);
  }

  



}
