import { ExternalUrlResolver } from './external.url.resolver';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class ExternalLogoutUrlResolver extends ExternalUrlResolver implements Resolve<void> {

    resolve(route: ActivatedRouteSnapshot) {
        this.redirectToExternalUrl('Account/Login/Logoff', route);
    }
}
