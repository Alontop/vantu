import { Component } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(private carritoService: CarritoService) {}

  abrirCarrito() {
    this.carritoService.toggleCarrito();
  }
}
