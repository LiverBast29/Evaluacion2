import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, delay } from 'rxjs';
import { UsuarioLogeado } from './../../interfaces/UsuarioLogeado';
import { Router } from '@angular/router'
// Importamos el servicio para hacer las peticiones
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private cargando: BehaviorSubject<boolean> =
  new BehaviorSubject(false);
  public $cargando = this.cargando.asObservable();
  private usuarioActivo: BehaviorSubject<UsuarioLogeado | null> =
  new BehaviorSubject<UsuarioLogeado | null>(null);
  public $usuarioActivo = this.usuarioActivo.asObservable();
  private readonly URL_LOGIN = "https://dummyjson.com/auth/login";

  constructor(
    private http: HttpClient,
    private router: Router
  ) {

  }

  public iniciarSesion(usuario: string, password: string){
    this.cargando.next(true);
    this.http.post<UsuarioLogeado>(this.URL_LOGIN,
      JSON.stringify({
        username: usuario,
        password
      }),
      {
      headers: {
        "Content-Type":"application/json"
      }
    }
    )
    .pipe(delay(2000))
    .subscribe( resultado => {
      this.usuarioActivo.next(resultado);
      this.cargando.next(false);
      this.router.navigate(['perfil-usuario'])
      console.log(this.usuarioActivo)
    });

  }
}
