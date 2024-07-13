import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from "./footer/footer.component";
import { CabeceraComponent } from "./cabecera/cabecera.component";
import { HomeComponent } from "./home/home.component";
import { EnviarDineroComponent } from "./enviar-dinero/enviar-dinero.component";


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [CommonModule, RouterOutlet, FooterComponent, CabeceraComponent, HomeComponent,
       EnviarDineroComponent]
})
export class AppComponent {
  title = 'billetera-front';

  showHeader: boolean = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.showHeader = !(event.url.includes('login') || event.url.includes('register'));
      }
    });
  }
}
