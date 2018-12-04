import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Attendee } from '../../../models/Attendee';
import { Pass } from '../../../models/Pass';
import { LabelsService } from '../../../services/labels.service';
import { Observable } from '../../../../../node_modules/rxjs';

@Component({
    // tslint:disable-next-line:component-selector
    selector: '[event-attendee]',
    templateUrl: './attendee.component.html',
    styleUrls: ['./attendee.component.css']
})
export class AttendeeComponent implements OnInit {
    @Input() attendee: Attendee; /* the attendee */
    @Input() passes: Pass[]; /* the event passes */
    @Input() editing: boolean; /* whether the component is in editing mode or read only mode */
    @Input() deleting: boolean; /* whether the component is in deleting mode or read only mode */
    /* whether the component is a placeholder, meaning it is in editing mode and it does not already represent an entry in the table */
    @Input() placeholder: boolean;
    @Input() waitlisted: boolean; /* whether this is an attendee in the waitlist */
    @Input() isJapanese: boolean; /* whether the language is japanese */
    @Input() autoregisterWaitlistItems: boolean; /* whether automatic registration for waitlisted items is enabled by default */
    @Input() showAutomaticRegistrationCheckbox: boolean; /* whether the checkbox for automatic registration is enabled */
    @Input() isFormValid: boolean; /* whether the form of custom registration fields is valid */
    @Input() canceledEditing: Function;
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onSaved = new EventEmitter<Attendee[]>(); /* event emitted when the attendee data is updated */
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onDeleted = new EventEmitter<Attendee>(); /* event fired when the attendee is deleted */
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onEditing = new EventEmitter<Attendee>(); /* event fired when the attendee is editing */
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onAdded = new EventEmitter<Attendee>(); /* event fired when the attendee is added */
    @ViewChild('firstName') firstName: ElementRef;

    private dummyAttendee: Attendee = {
      firstName: '',
      lastName: '',
      email: '',
      passId: '',
      waitlisted: this.waitlisted,
      autoRegister: false,
      responses: []
  };

    constructor(private labelsService: LabelsService) {
    }

    ngOnInit() {
        if (!this.attendee) {
            this.setDummyAttendee();
        }
    }

    public canAutoRegister(): boolean {
        // can only auto-register for unpaid events
        return this.waitlisted && this.passes.length === 0 && !this.autoregisterWaitlistItems && this.showAutomaticRegistrationCheckbox;
    }

    public confirmEdit(form: NgForm): void {
        const attendeeBefore = this.deepClone(this.attendee);
        this.attendee = {
            firstName: form.value.firstName,
            lastName: form.value.lastName,
            email: form.value.email,
            passId: form.value.passId || '',
            waitlisted: this.waitlisted,
            autoRegister: form.value.autoRegister || false,
            responses: []
        };

        if (!this.placeholder && this.editing) {
            // existing attendee was updated
            this.editing = false;
            if (attendeeBefore.passId !== this.attendee.passId) {
                this.incrementPassesUsed(this.attendee.passId);
                this.decrementPassesUsed(attendeeBefore.passId);
            }
            this.onSaved.emit([attendeeBefore, this.attendee]);

        } else if (!this.placeholder && this.deleting) {
            // existing attendee was deleted
            this.deleting = false;
        } else {
            // attendee added
            if (this.attendee.passId) {
                this.incrementPassesUsed(this.attendee.passId);
            }

            this.onAdded.emit(this.attendee);
            this.setDummyAttendee();
            form.reset();
            this.firstName.nativeElement.focus();
            // angular sets the values to null on reset. we need to manually select the placeholder value for the pass dropdown
            if (form.controls.passId) {
                form.controls.passId.setValue('');
            }
        }
    }

    private cancelEdit(): void {
        this.editing = false;
        this.canceledEditing();
    }

    private switchToEdit(attendee: Attendee): void {
        this.editing = true;
        if (!this.waitlisted) {
            this.onEditing.emit(this.attendee);
        }
    }

    private removeAttendee(): void {
        this.deleting = true;
        if (this.attendee.passId){
            this.decrementPassesUsed(this.attendee.passId);
        }
        this.onDeleted.emit(this.attendee);
    }

    private setDummyAttendee() {
        this.attendee = this.deepClone(this.dummyAttendee);
    }

    private passDisplayString(passId: string): string {
        const pass = this.pass(passId);
        return `${pass.passName} (${pass.currencySymbol}${pass.price})`;
    }

    private pass(passId: string): Pass {
        const idx = this.passes.findIndex(p => p.passId === passId);
        return this.passes[idx];
    }

    private incrementPassesUsed(passId: string): void {
        this.pass(passId).passesUsed++;
    }

    private decrementPassesUsed(passId: string): void {
        this.pass(passId).passesUsed--;
    }

    private deepClone(obj: Attendee): Attendee {
        return JSON.parse(JSON.stringify(obj)) as Attendee;
    }
}
