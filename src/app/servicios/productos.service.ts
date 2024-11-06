import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto, RespuestaProducto } from './../interfaces/Producto';
import { LoadingController } from '@ionic/angular';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private readonly URL_PRODUCTO = "https://dummyjson.com/products?skip="
  public productos: Producto[]=[];
  private skip = 0;
  private limite = 30;
  constructor(
    private http: HttpClient,
    private loading: LoadingController
  ) { }

  public async consultarProductos(){
    const control = await this.loading.create({
      message: "Cargando..."
    });
    control.present();
    this.http.get<RespuestaProducto>(`${this.URL_PRODUCTO}${this.skip}`)
    .pipe(delay(4000))
    .subscribe( respuesta => {
      control.dismiss();
      this.skip = this.skip + respuesta.limit;
      this.limite = respuesta.limit;
      this.productos = this.productos.concat(respuesta.products); 
    });
  }


}
