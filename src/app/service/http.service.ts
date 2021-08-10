import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            withCredentials: true,
            setHeaders: this.mountHeader()
        });
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(error);
            }),
            map((event: HttpEvent<any>) => {
                return event;
            })
        );
    }

    mountHeader() {
        const header: any = {};
        const token = window.localStorage.getItem('token');
        if (token && token.length > 0) {
            header.Authorization = `Bearer ${token}`;
        }
        return header;
    }
}
