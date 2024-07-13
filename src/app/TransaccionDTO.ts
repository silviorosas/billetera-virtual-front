export interface TransaccionDTO {
    id: number;
    tipo: string;
    monto: number;
    fecha: string;
    nombreUsuarioOrigen: string;
    nombreUsuarioDestino: string;
    tipoTransaccion: string; // Nuevo atributo para indicar si el dinero fue recibido o enviado
  }
  