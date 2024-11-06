import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { UsuarioLogeado } from './../interfaces/UsuarioLogeado';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private cargando: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public $cargando = this.cargando.asObservable();

  private usuarioActivo: BehaviorSubject<UsuarioLogeado | null> = new BehaviorSubject<UsuarioLogeado | null>(null);
  public $usuarioActivo = this.usuarioActivo.asObservable();

  private readonly URL_LOGIN = "https://dummyjson.com/auth/login";
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  public iniciarSesion(usuario: string, password: string) {
    this.cargando.next(true);

    this.http.post<UsuarioLogeado>(
      this.URL_LOGIN,
      { username: usuario, password: password },
      {
        headers: { "Content-Type": "application/json" },
      }
    )
    .pipe(
      delay(2000),
      catchError(this.handleError.bind(this)) // Manejo de errores
    )
    .subscribe({
      next: (resultado) => {
        this.usuarioActivo.next(resultado);
        this.token = resultado.token; // Guarda el token recibido
        this.cargando.next(false);
        this.router.navigate(['productos']); // Redirige a la página de productos
      },
      error: () => {
        this.cargando.next(false);
        alert("Credenciales inválidas. Por favor, intente de nuevo.");
      },
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error inesperado. Intente nuevamente.';
    if (error.status === 400) {
      errorMessage = 'Credenciales inválidas. Por favor, verifique e intente de nuevo.';
    }
    console.error('Error en la autenticación:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  public cerrarSesion() {
    this.token = null; // Elimina el token almacenado
    this.usuarioActivo.next(null); // Limpia el usuario activo
  }
  
}
