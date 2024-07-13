
import { ApplicationModule, Component, NgModule } from '@angular/core';
import { NgIf } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-qr-decoder',
  standalone: true,
  imports: [NgIf,HttpClientModule],
  templateUrl: './qr-decoder.component.html',
  styleUrl: './qr-decoder.component.css'
})
export class QrDecoderComponent {
  selectedFile: File | null = null;
  qrText: string | null = null;
  error: string | null = null;

  constructor(private http: HttpClient) { }

  onFileSelected(event: Event): void {
    this.selectedFile = (event.target as HTMLInputElement).files?.[0] || null;
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      alert('Por favor, seleccione un archivo');
      return;
    }
  
    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile);
  
    this.http.post<any>('http://localhost:8080/api/decodificar-qr', formData)
      .subscribe(
        response => {
          this.qrText = response.qrText;
          console.log("qr: ",response)
        },
        error => {
          console.error('Error al decodificar el código QR:', error);
          this.qrText = 'Error al decodificar el código QR';
        }
      );
  }
  
}
