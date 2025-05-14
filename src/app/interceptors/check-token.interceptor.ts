import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CanalPlusServiceService } from 'app/services/canal-plus-service.service';

@Injectable()
export class CheckTokenInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {
    console.log('AuthInterceptor - constructor');
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const canalPlusService = this.injector.get(CanalPlusServiceService); // Récupérer AuthService dynamiquement
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('intercept - error:', error);

        if (error.status === 401) {
          // Supposons que 401 signifie "token invalide"
          return canalPlusService.refreshToken().pipe(
            switchMap((newToken) => {
              // Cloner et renvoyer la requête avec le nouveau token
              const clonedRequest = req.clone({
                url: req.url.replace(canalPlusService.getOldToken(), newToken),
              });
              return next.handle(clonedRequest);
            }),
          );
        }
        return throwError(() => error);
      }),
    );
  }
}
