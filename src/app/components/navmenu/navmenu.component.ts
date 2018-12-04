import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../../models/Event';
import { UserService } from '../../services/user.service';
import { EventService } from '../../services/event.service';
import { User } from '../../models/User';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy {
    public currentEvent: Event | null;
    user: User;
    showUserMenu: boolean;

    private authenticatedUserListener: Subscription;

    constructor(
        private eventService: EventService,
        private route: ActivatedRoute,
        private userService: UserService) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(route => {
            const readableEventId = route['id'];
            if (readableEventId) {
                this.loadEvent(readableEventId);
            } else {
                this.currentEvent = null;
            }
        });

        this.showUserMenu = environment.areUsersSupported;
        this.user = UserService.AnonymousUser;
        this.authenticatedUserListener = this.userService.getLoggedInUser()
        .subscribe(user => {
            this.user = user;
        }, error => console.error(error));
    }

    ngOnDestroy(): void {
        if (this.authenticatedUserListener) {
            this.authenticatedUserListener.unsubscribe();
        }
    }

    private loadEvent(readableEventId: string): void {
        this.eventService.getEvent(readableEventId).subscribe(event => {
            this.currentEvent = event;
        }, error => console.error(error));
    }
}

