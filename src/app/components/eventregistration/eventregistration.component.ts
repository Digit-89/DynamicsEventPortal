import { environment } from './../../../environments/environment';
import { CaptchaService } from './../../services/captcha.service';
import { Component, OnInit, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Attendee } from '../../models/Attendee';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from '../../models/Event';
import { Pass } from '../../models/Pass';
import { RegistrationData } from '../../models/RegistrationData';
import { RegistrationResult } from '../../models/RegistrationResult';
import { HipObject } from '../../models/HipObject';
import * as CustomRegistrationFieldModel from '../../models/CustomRegistrationField';
import { CustomRegistrationFieldResponse } from '../../models/CustomRegistrationFieldResponse';
import { EventService } from '../../services/event.service';
import { LabelsService } from '../../services/labels.service';
import { SessionService } from '../../services/session.service';

@Component({
    selector: 'app-eventregistration',
    templateUrl: './eventregistration.component.html',
    styleUrls: ['./eventregistration.component.css']
})
export class EventRegistrationComponent implements OnInit {
    attendees: Attendee[];
    waitlistedAttendees: Attendee[];
    event: Event;
    passes: Pass[];
    registrationCount: number;
    readableEventId: string;
    registrationInProgress: boolean;
    errorMessage: string;
    customRegistrationFields: CustomRegistrationFieldModel.CustomRegistrationField[];
    isJapanese: boolean;
    showCaptcha: boolean;

    private total = 0.0;
    private currencySymbol = "$";

    constructor(
        private eventService: EventService,
        private captchaService: CaptchaService,
        private route: ActivatedRoute,
        private router: Router,
        private labelsService: LabelsService,
        private sessionService: SessionService
    ) {
        this.attendees = [];
        this.waitlistedAttendees = [];
    }

    ngOnInit() {
        this.showCaptcha = environment.useCaptcha;
        this.readableEventId = this.route.snapshot.queryParams['id'];
        this.loadEvent();
        this.loadCustomRegistrationFields();

        this.labelsService.getLabelsModel().subscribe(labelsModel => {
            this.isJapanese = labelsModel.isJapanese;
        });
    }

    public clearForms(): void {
        let selectorResults = document.querySelectorAll(
            '.event-customregistrationsfields-container input'
        );
        let selectorResult: any;
        let i: number;
        for (i = 0; i < selectorResults.length; i++) {
            selectorResult = selectorResults[i];
            selectorResult.value = '';
            selectorResult.dispatchEvent(new Event('input'));
        }

        selectorResults = document.querySelectorAll(
            '.event-customregistrationsfields-container input:checked'
        );
        for (i = 0; i < selectorResults.length; i++) {
            selectorResult = selectorResults[i];
            selectorResult.checked = false;
        }

        selectorResults = document.querySelectorAll(
            '.event-customregistrationsfields-container select'
        );
        for (i = 0; i < selectorResults.length; i++) {
            selectorResult = selectorResults[i];
            selectorResult.selectedIndex = 0;
        }
    }

    private loadEvent(): void {
        this.eventService.getEvent(this.readableEventId).subscribe(event => {
            this.event = event;

            if (this.event) {
                this.loadEventRegistrationCount();
                this.loadEventPasses();
            }
        },
        error => console.error(error));
    }

    private loadCustomRegistrationFields() {
        this.eventService.getCustomRegistrationFields(this.readableEventId).subscribe(customRegistrationFields => {
            this.customRegistrationFields = customRegistrationFields;
        },
        error => console.error(error));
    }

    private getOptions(str: string): string[] {
        return str.split('\u000a');
    }

    private splitResponses(str: string): string[] {
        return str.split(', ');
    }

    private loadEventPasses(): void {
        this.eventService.getPasses(this.readableEventId).subscribe(passes => {
            this.passes = passes;
            for (const pass of this.passes) {
                pass.passesUsed = 0;
            }
        },
        error => console.error(error));
    }

    private loadEventRegistrationCount(): void {
        this.eventService.getEventRegistrationCount(this.readableEventId).subscribe(registrationCount => {
            this.registrationCount = registrationCount;
        },
        error => console.error(error));
    }

    public dataLoaded(): boolean {
        return (
            this.registrationCount !== undefined && this.passes !== undefined
        );
    }

    private showWaitlist(): boolean {
        if (!this.paidEvent()) {
            return (
                this.event.showWaitlist &&
                this.event.maxCapacity !== null &&
                this.isAttendeeCountExceedingEventCapacity()
            );
        }

        return (this.event.showWaitlist && (this.allPassesSoldOut() || this.isAttendeeCountExceedingEventCapacity()));
    }

    private isAttendeeCountExceedingEventCapacity(): boolean {
        return this.attendees.length + this.registrationCount >= this.event.maxCapacity;
    }

    private allPassesSoldOut(): boolean {
        for (const pass of this.passes) {
            if (pass.numberOfPassesLeft > pass.passesUsed) {
                return false;
            }
        }

        return true;
    }

    private addResponsesToAttendee(attendee: Attendee): Attendee {
        attendee.responses = [];
        let fieldId, type;
        let checkboxChecked;
        for (const next of this.customRegistrationFields) {
            let fieldValue = '';
            fieldId = next.customRegistrationFieldId;
            type = next.type;

            if (type === CustomRegistrationFieldModel.Types.Boolean) {
                checkboxChecked = (<any>document.getElementById(fieldId))
                    .checked;
                fieldValue = checkboxChecked ? 'Yes' : 'No';
            } else {
                fieldValue = (<any>document.getElementById(fieldId)).value;
            }

            const customRegistrationResponse: CustomRegistrationFieldResponse = {
                id: fieldId,
                value: fieldValue
            };

            attendee.responses.push(customRegistrationResponse);
        }

        return attendee;
    }

    private addAttendee(attendee: Attendee, waitlisted: boolean): void {
        if (waitlisted) {
            this.waitlistedAttendees.push(attendee);
        } else {
            attendee = this.addResponsesToAttendee(attendee);
            this.attendees.push(attendee);
            this.clearForms();
        }

        this.updateTotal(null, attendee.passId);
    }

    private removeAttendee(attendee: Attendee, waitlisted: boolean): void {
        const index = this.findAttendeeIndex(attendee, waitlisted);
        if (index !== -1) {
            if (waitlisted) {
                this.waitlistedAttendees.splice(index, 1);
            } else {
                const removedPassId = this.attendees[index].passId;
                this.attendees.splice(index, 1);

                // Move the first waitlisted attendee to the registrants
                if (this.waitlistedAttendees.length > 0) {
                    if (this.paidEvent()) {
                        /* for paid events we cannot just move the first waitlisted attendee to attendees
                      as there may be a conflict with passes try to find a waitlisted attendee that wants
                      to buy the same pass that the removed attendee had and move that one */
                        const idx = this.indexOfFirstWaitlistedAttendeeWithPassId(
                            removedPassId
                        );
                        if (idx !== -1) {
                            this.attendees.push(this.waitlistedAttendees[idx]);
                            this.waitlistedAttendees.splice(idx, 1);
                        }
                    } else {
                        // for unpaid events we can just move any of the waitlisted attendees
                        this.attendees.push(this.waitlistedAttendees[0]);
                        this.waitlistedAttendees.splice(0, 1);
                    }
                }
            }

            this.updateTotal(attendee.passId, null);
        }

        this.clearForms();
    }

    /**
     * Finds the index of the first waitlisted attendee with a specified pass
     * @param passId The pass id
     */
    private indexOfFirstWaitlistedAttendeeWithPassId(passId: string) {
        return this.waitlistedAttendees.findIndex(a => a.passId === passId);
    }

    /**
     * Event handler for the update attendee event of the attendee component
     * @param attendees An array of length 2, the first item being the attendee before the update operation,
     * the second is the attendee after the update
     * @param waitlisted Whether the attendee updated is in the waitlist or not
     */
    private updateAttendee(attendees: Attendee[], waitlisted: boolean): void {
        const index = this.findAttendeeIndex(attendees[0], waitlisted);
        if (index !== -1) {
            if (waitlisted) {
                this.waitlistedAttendees[index] = attendees[1];
            } else {
                const attendee = this.addResponsesToAttendee(attendees[1]);
                this.attendees[index] = attendee;
                this.clearForms();
            }

            this.updateTotal(attendees[0].passId, attendees[1].passId);
        }
    }

    /**
     * Finds the index of the attendee
     * @param attendee The attendee
     * @param waitlisted If true the waitlisted attendee list will be searched, otherwise the attendee list
     */
    private findAttendeeIndex(attendee: Attendee, waitlisted: boolean): number {
        return waitlisted
            ? this.waitlistedAttendees.findIndex(
                  a =>
                      a.firstName === attendee.firstName &&
                      a.lastName === attendee.lastName &&
                      a.email === attendee.email
              )
            : this.attendees.findIndex(
                  a =>
                      a.firstName === attendee.firstName &&
                      a.lastName === attendee.lastName &&
                      a.email === attendee.email
              );
    }

    private updateTotal(passIdToRemove: string, passIdToAdd: string): void {
        if (passIdToRemove != null) {
            this.total -= this.findPassValue(passIdToRemove);
        }

        if (passIdToAdd != null) {
            this.total += this.findPassValue(passIdToAdd);
        }
    }

    private findPassValue(passId: string): number {
        const pass: Pass = this.passes.find(p => p.passId === passId);
        if (pass) {
            this.currencySymbol = pass.currencySymbol;
            return pass.price;
        } else {
            return 0.0;
        }
    }

    private checkout(): void {
        let hipObjectResult: HipObject = CaptchaService.EmptyHipObject;
        hipObjectResult = this.captchaService.getHipObject();

        if (this.paidEvent()) {
            this.sessionService.setCaptcha(hipObjectResult);
        }

        let attendeesToSend: Attendee[] = [];
        attendeesToSend = attendeesToSend.concat(this.attendees);
        attendeesToSend = attendeesToSend.concat(this.waitlistedAttendees);

        const registrationData: RegistrationData = {
            attendees: attendeesToSend,
            hipObject: hipObjectResult
        };

        if (!environment.useCaptcha) {
            registrationData.hipObject = undefined;
        }

        this.registrationInProgress = true;

        this.eventService.registerToEvent(this.readableEventId, registrationData)
            .subscribe(registrationResult => {
                if (registrationResult.status === 'Success') {
                    this.router.navigate(['../confirmation'], {
                        relativeTo: this.route,
                        queryParams: {
                            id: this.event.readableEventId
                        }
                    });
                } else if (registrationResult.status === 'Initiated') {
                    this.router.navigate(['../payment'], {
                        relativeTo: this.route,
                        queryParams: {
                            id: this.event.readableEventId,
                            total: this.total,
                            currencySymbol: this.currencySymbol,
                            purchaseId: registrationResult.purchaseId
                        }
                    });
                } else if (registrationResult.status === 'Redirect') {
                    this.sessionService.setPurchaseId(registrationResult.purchaseId);
                    window.location.href = registrationResult.redirectUrl + '&total=' + this.total;
                } else {
                    this.errorMessage = registrationResult.errorMessage;
                }
            }, error => this.errorMessage = error.message)
            .add(() => {
                this.registrationInProgress = false;
            });
    }

    private checkoutButtonDisabled(): boolean {
        return this.registrationInProgress || (this.attendees.length === 0 && this.waitlistedAttendees.length === 0);
    }

    private paidEvent(): boolean {
        return this.passes.length > 0;
    }

    private autoregisterWaitlistItems(): boolean {
        return this.event.autoregisterWaitlistItems;
    }

    private showAutomaticRegistrationCheckbox(): boolean {
        return this.event.showAutomaticRegistrationCheckbox;
    }

    private calculateMultipleCheckboxes(): void {
        let fieldId, type, choices;
        let checkboxChecked, choicesArray;
        for (const next of this.customRegistrationFields) {
            let fieldValue = '';
            fieldId = next.customRegistrationFieldId;
            type = next.type;

            if (type === CustomRegistrationFieldModel.Types.MultipleChoice) {
                choices = next.choices;
                choicesArray = this.getOptions(choices);
                for (let i = 0; i < choicesArray.length; i++) {
                    checkboxChecked = (<any>(
                        document.getElementById(fieldId + '-' + i)
                    )).checked;
                    if (checkboxChecked) {
                        if (fieldValue !== '') {
                            fieldValue += ', ';
                        }
                        fieldValue += choicesArray[i];
                    }
                }

                const myInput: any = document.getElementById(fieldId);
                myInput.value = fieldValue;
                myInput.dispatchEvent(new Event('input'));
            }
        }
    }

    private loadResponsesToFields(attendee: Attendee): void {
        let fieldId, type, choices;
        let choicesArray, responsesArray;
        for (const next of this.customRegistrationFields) {
            fieldId = next.customRegistrationFieldId;
            type = next.type;
            choices = next.choices;

            const response = attendee.responses[attendee.responses.findIndex(a => a.id === fieldId)];

            if (type === CustomRegistrationFieldModel.Types.Boolean) {
                if (response.value === 'Yes') {
                    (<any>document.getElementById(fieldId)).checked = true;
                }
            } else if (type === CustomRegistrationFieldModel.Types.MultipleChoice) {
                choicesArray = this.getOptions(choices);
                responsesArray = this.splitResponses(response.value);
                for (let i = 0; i < choicesArray.length; i++) {
                    const index = responsesArray.findIndex(
                        a => a === choicesArray[i]
                    );
                    if (index !== -1) {
                        (<any>(document.getElementById(fieldId + '-' + i))).checked = true;
                    }
                }

                const element: any = <any>document.getElementById(fieldId);
                element.value = response.value;
                element.dispatchEvent(new Event('input'));
            } else {
                const element: any = <any>document.getElementById(fieldId);
                element.value = response.value;
                element.dispatchEvent(new Event('input'));
            }
        }
    }
}
