import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, catchError } from 'rxjs/operators';

import { FilterService } from '../services/filter.service';

@Injectable()
export class CarDataGuard implements CanActivate {
    constructor(private filterService: FilterService) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        // allow route navigation when data is retrieved
        return this.filterService.getData()
            .pipe(
                map(data => true),
                catchError(error => of(false))
            );
    }
}
