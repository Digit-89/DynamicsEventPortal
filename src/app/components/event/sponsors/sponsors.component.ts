import { EventService } from '../../../services/event.service';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { Sponsorship } from '../../../models/Sponsorship';
import { ImageHelper } from '../../../helpers/ImageHelper';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.css']
})
export class SponsorsComponent implements OnInit {
    @Input() readableEventId: string;
    public sponsorships: Sponsorship[];
    private defaultImageUrl = 'speakers/default_sponsor_image.png';

    constructor(private eventService: EventService, private imageHelper: ImageHelper) {
    }

    ngOnInit() {
        this.loadSponsors();
    }

    private loadSponsors() {
        this.eventService.getSponsors(this.readableEventId)
        .subscribe(sponsorships => {
            this.sponsorships = sponsorships;
        }, error => console.error(error));
    }
}
