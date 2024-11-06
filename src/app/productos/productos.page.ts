import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from '../servicios/productos.service';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  constructor(public productos: ProductosService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.productos.consultarProductos(); // Carga los productos
  }

  salir() {
    this.authService.cerrarSesion(); // metodo cerrar sesion en AuthService
    this.router.navigate(['iniciar-sesion']); 
  }
}
