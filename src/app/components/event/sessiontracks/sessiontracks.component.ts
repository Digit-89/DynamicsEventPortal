import { EventService } from '../../../services/event.service';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { SessionTrack } from '../../../models/SessionTrack';

@Component({
  selector: 'app-sessiontracks',
  templateUrl: './sessiontracks.component.html',
  styleUrls: ['./sessiontracks.component.css']
})
export class SessiontracksComponent implements OnInit {
    @Input() readableEventId: string;
    sessionTracks: SessionTrack[];

    constructor(private eventService: EventService) {
    }

    ngOnInit() {
        this.loadSessionTracks();
    }

    private loadSessionTracks(): void {
        this.eventService.getSessionTracks(this.readableEventId).subscribe(tracks => {
            this.sessionTracks = tracks;
        }, error => console.error(error));
    }
}
