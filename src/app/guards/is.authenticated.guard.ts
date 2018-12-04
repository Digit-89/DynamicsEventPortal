import { UserService } from './../services/user.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class IsAuthenticatedGuard implements CanActivate {

    constructor(private userService: UserService) {
    }

    canActivate(): Observable<boolean> {
        return this.userService.isLoggedIn();
    }
}
