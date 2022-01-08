import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HttpCacheService } from './http-cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(private cacheService: HttpCacheService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // pass along non-cacheable requests
    // (will also invalidate the cache)
    if (request.method !== 'GET') {
      console.log(`Invalidating cache: ${request.method} ${request.url}`);
      // only useful as a showcase invalidation strategy:
      this.cacheService.invalidateCache();      
      return next.handle(request);
    }

    // attempt to retrieve a cached response
    const cachedResponse: HttpResponse<any> = this.cacheService.get(request.url);

    // return cached response
    if (cachedResponse) {
      console.log(`Returning a cached response: ${cachedResponse.url}`, cachedResponse);
      return of(cachedResponse);
    }

    // send request to server and add response to cache
    return next.handle(request)
      .pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            console.log(`Adding item to cache: ${request.url}`);
            this.cacheService.put(request.url, event);
          }
        })
      );
  }
}
