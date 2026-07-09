import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { ProductoService } from '../../services/producto.service';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  mensajeNotificacion: string = '';
  productos: any[] = [];

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
  ) {}

  ngOnInit(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      },
    });
  }

  agregarAlCarrito(producto: any) {
    this.carritoService.agregarProducto(producto);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'clic_agregar_al_carrito',
      producto_nombre: producto.nombre,
      producto_id: producto.id,
    });

    this.mensajeNotificacion = `¡Producto agregado al carrito!`;

    setTimeout(() => {
      this.mensajeNotificacion = '';
    }, 3000);
  }
}
