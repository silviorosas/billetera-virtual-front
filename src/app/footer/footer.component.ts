import { NgIf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgIf],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  isMenuVisible = false;

  constructor(private router: Router) {}

  toggleMenu(event: MouseEvent) {
    this.isMenuVisible = !this.isMenuVisible;
    event.stopPropagation(); // Evita que el evento se propague al documento
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.isMenuVisible = false;
  }

  logout() {
    localStorage.removeItem('authToken'); // O el nombre que uses para el token
    this.router.navigate(['/login']);
  }

}
