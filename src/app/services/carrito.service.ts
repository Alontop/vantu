import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private abierto = new BehaviorSubject<boolean>(false);
  abierto$ = this.abierto.asObservable();

  private productos = new BehaviorSubject<any[]>([]);
  productos$ = this.productos.asObservable();

  agregarProducto(producto: any) {
    const actuales = this.productos.value;

    const indice = actuales.findIndex((p) => p.id === producto.id);

    if (indice !== -1) {
      const nuevosProductos = [...actuales];
      nuevosProductos[indice].cantidad =
        (nuevosProductos[indice].cantidad || 1) + 1;
      this.productos.next(nuevosProductos);
    } else {
      const nuevoProducto = { ...producto, cantidad: 1 };
      this.productos.next([...actuales, nuevoProducto]);
    }
  }

  obtenerProductos() {
    return this.productos.value;
  }

  toggleCarrito() {
    this.abierto.next(!this.abierto.value);
  }

  cambiarCantidad(productoId: number, delta: number) {
    const actuales = this.productos.value;
    const index = actuales.findIndex((p) => p.id === productoId);

    if (index !== -1) {
      const nuevos = [...actuales];
      nuevos[index].cantidad += delta;

      if (nuevos[index].cantidad <= 0) {
        nuevos.splice(index, 1);
      }
      this.productos.next(nuevos);
    }
  }

  obtenerTotal(): number {
    return this.productos.value.reduce(
      (acc, p) => acc + p.precio * p.cantidad,
      0,
    );
  }

  limpiarCarrito() {
    this.productos.next([]);
  }
}
