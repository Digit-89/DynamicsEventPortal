import { EventService } from '../../../services/event.service';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { Session } from '../../../models/Session';

@Component({
    selector: 'app-listofsessionspertrack',
    templateUrl: './listofsessionspertrack.component.html',
    styleUrls: ['./listofsessionspertrack.component.css']
})
export class ListofsessionspertrackComponent implements OnInit {
    @Input() trackId: string;
    sessions: Session[];

    constructor(private eventService: EventService) {
    }

    ngOnInit() {
        this.loadSessions();
    }

    private loadSessions(): void {
        this.eventService.getSessionsInATrack(this.trackId).subscribe(sessions => {
            this.sessions = sessions;
        }, error => console.error(error));
    }
}
