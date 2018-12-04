import { EventService } from '../../services/event.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../../models/Event';
import { ImageHelper } from '../../helpers/ImageHelper';

@Component({
    selector: 'app-event',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
    public readableEventId: string;
    public event: Event;
    private defaultImageUrl = 'homehero.jpg';

    constructor(
      private route: ActivatedRoute,
      private eventService: EventService,
      private imageHelper: ImageHelper
    ) { }

    ngOnInit() {
        this.readableEventId = this.route.snapshot.queryParams['id'];
        this.loadEvent(this.readableEventId);
    }

    private loadEvent(id: string) {
        this.eventService.getEvent(id).subscribe(event => {
            this.event = event;
        }, error => console.error(error));
    }

    public getBannerImage() {
        return this.event.image ? this.event.image : this.imageHelper.getImage(null, this.defaultImageUrl)
    }
}
