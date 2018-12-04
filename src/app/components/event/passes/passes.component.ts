import { EventService } from '../../../services/event.service';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { Pass } from '../../../models/Pass';

@Component({
    selector: 'app-passes',
    templateUrl: './passes.component.html',
    styleUrls: ['./passes.component.css']
})
export class PassesComponent implements OnInit {
    @Input() readableEventId: string;
    passes: Pass[];

    constructor(private eventService: EventService) { }

    ngOnInit() {
        this.loadPasses();
    }

    private loadPasses(): void {
        this.eventService.getPasses(this.readableEventId).subscribe(passes => {
            this.passes = passes;
        }, error => console.error(error));
    }
}
