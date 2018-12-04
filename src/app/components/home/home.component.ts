import { EventService } from '../../services/event.service';
import { Component, Inject, OnInit } from '@angular/core';
import { EntityReference } from '../../models/EntityReference';
import { Event } from '../../models/Event';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public allEvents: Event[];

    constructor(private eventService: EventService) {
    }

    ngOnInit(): void {
        this.eventService.getPublishedEvents().subscribe(events => {
            this.allEvents = events;
        }, error => console.error(error));
    }
}
