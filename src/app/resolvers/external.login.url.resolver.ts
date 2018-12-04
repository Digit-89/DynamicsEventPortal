import { ExternalUrlResolver } from './external.url.resolver';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class ExternalLoginUrlResolver extends ExternalUrlResolver implements Resolve<void> {

    resolve(route: ActivatedRouteSnapshot) {
        this.redirectToExternalUrl('SignIn', route);
    }
}
