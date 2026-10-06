import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('closetly_token');

  // Do not attach JWT to login or registration requests
  if (
    req.url.includes('/login/') ||
    req.url.includes('/register/')
  ) {
    return next(req);
  }

  // Attach JWT to other requests
  if (token) {

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq);
  }

  return next(req);
};