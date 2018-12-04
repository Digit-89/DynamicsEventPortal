import { Component, OnInit } from '@angular/core';
import { LabelsService } from '../../services/labels.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(public labelsService: LabelsService) {}

    ngOnInit() {
        this.labelsService.getLabelsModel().subscribe(labelsModel => {
            // force get the labels
        });
    }
}
