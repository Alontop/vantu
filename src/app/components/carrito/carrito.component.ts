import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../services/venta.service';

@Component({
  selector: 'app-carrito-flotante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
})
export class CarritoFlotanteComponent {
  estaAbierto: boolean = false;
  productosCarrito: any[] = [];
  nombreCliente: string = '';
  metodoPagoSeleccionado: string = 'Tarjeta';
  detallePago: string = '';
  placeholderTexto: string = 'Ingrese número de tarjeta';

  constructor(
    public carritoService: CarritoService,
    private ventaService: VentaService,
  ) {
    this.carritoService.abierto$.subscribe((estado) => {
      this.estaAbierto = estado;
    });
    this.carritoService.productos$.subscribe((lista) => {
      this.productosCarrito = lista;
    });
  }

  ajustarCampoPago() {
    if (this.metodoPagoSeleccionado === 'Yape / Plin') {
      this.detallePago = 'PAGO CONTRAENTREGA';
      this.placeholderTexto = '';
    } else {
      this.detallePago = '';
      this.placeholderTexto = 'Ingrese número de tarjeta';
    }
  }
  get esDeshabilitado(): boolean {
    return this.metodoPagoSeleccionado === 'Yape / Plin';
  }

  cerrar() {
    this.carritoService.toggleCarrito();
  }

  ajustarCantidad(productoId: number, delta: number) {
    this.carritoService.cambiarCantidad(productoId, delta);
  }

  procesarPago() {
    if (this.nombreCliente.trim() === '') {
      alert('Por favor, ingresa tu nombre');
      return;
    }

    const pedido = {
      nombreCliente: this.nombreCliente,
      total: this.carritoService.obtenerTotal(),
      metodoPago: this.metodoPagoSeleccionado,
      detallePago: this.detallePago,
      productos: this.productosCarrito,
    };

    this.ventaService.registrarVenta(pedido).subscribe({
      next: (res) => {
        alert('¡Compra exitosa! Gracias por tu pedido.');
        this.carritoService.limpiarCarrito();
        this.nombreCliente = '';
        this.detallePago = '';
        this.metodoPagoSeleccionado = 'Tarjeta';
        this.placeholderTexto = 'Ingrese número de tarjeta';
        this.cerrar();
      },
      error: (err) => {
        console.error('Error al registrar venta:', err);
        alert('Hubo un error al procesar tu pago. Inténtalo de nuevo.');
      },
    });
  }
}
