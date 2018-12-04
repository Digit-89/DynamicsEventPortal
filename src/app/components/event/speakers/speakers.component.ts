import { EventService } from '../../../services/event.service';
import { Component, OnInit, Input, Inject, ElementRef } from '@angular/core';
import { Speaker } from '../../../models/Speaker';
import { ImageHelper } from '../../../helpers/ImageHelper';
import { Http } from '@angular/http';
import { Image } from '../../../models/Image';;

@Component({
  selector: 'app-speakers',
  templateUrl: './speakers.component.html',
  styleUrls: ['./speakers.component.css']
})
export class SpeakersComponent implements OnInit {
    @Input() readableEventId: string;
    public speakers: Speaker[];
    public speaker: Speaker;
    private defaultImageUrl = 'speakers/default_contact_image.png';

    constructor(private eventService: EventService, private imageHelper: ImageHelper) {
    }

    ngOnInit() {
        this.loadSpeakers();
    }

    private loadSpeakers() {
        this.eventService.getSpeakers(this.readableEventId).subscribe(speakers => {
            this.speakers = speakers;
        }, error => console.error(error));
    }

    showSpeakerDetails(speaker: Speaker, bob: object) {
        // Clear out the previous hidden speaker if exists
        if (this.speaker != null){           
            document.getElementById(this.speaker.id).style.display = "block";
        }
        
        // Hide the current speaker
        this.speaker = speaker;
        document.getElementById(speaker.id).style.display = "none";
    }
}
