import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private apiUrl = 'https://vantu-backend.onrender.com/api/ventas';

  constructor(private http: HttpClient) {}

  registrarVenta(pedido: any): Observable<any> {
    return this.http.post(this.apiUrl, pedido, { responseType: 'text' }).pipe(
      tap((respuesta) => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'purchase',
          cliente: pedido.nombreCliente,
          value: pedido.total,
          currency: 'PEN',
          transaction_id: 'TX_' + new Date().getTime(),
        });
      }),
    );
  }
}
