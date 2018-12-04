import { environment } from './../../environments/environment';
import { FinalizeRegistrationRequest } from './../models/FinalizeRegistrationRequest';
import { RegistrationResult } from '../models/RegistrationResult';
import { Captcha } from '../models/Captcha';
import { Sponsorship } from '../models/Sponsorship';
import { Speaker } from '../models/Speaker';
import { SessionTrack } from '../models/SessionTrack';
import { Session } from '../models/Session';
import { Pass } from '../models/Pass';
import { HttpHelper } from '../helpers/HttpHelper';
import { Injectable } from '@angular/core';
import { Event } from '../models/Event';
import { Observable } from 'rxjs';
import { RegistrationData } from '../models/RegistrationData';
import * as CustomRegistrationFieldModel from '../models/CustomRegistrationField';

@Injectable()
export class EventService {

    private static readonly eventsEndpoint: string = 'api/events';
    private static readonly tracksEndpoint: string = 'api/tracks';

    constructor(private http: HttpHelper) {
    }

    public getPublishedEvents(): Observable<Event[]> {
        return this.http.get<Event[]>(`${environment.baseUrl}${EventService.eventsEndpoint}/published/`);
    }

    public getEvent(readableEventId: string): Observable<Event> {
        return this.http.get<Event>(
            `${environment.baseUrl}${EventService.eventsEndpoint}/event/?readableEventId=${readableEventId}`
        );
    }

    public getPasses(readableEventId: string): Observable<Pass[]> {
        return this.http.get<Pass[]>(
            `${environment.baseUrl}${EventService.eventsEndpoint}/passes/?readableEventId=${readableEventId}`
        );
    }

    public getSessions(readableEventId: string): Observable<Session[]> {
        return this.http.get<Session[]>(
            `${environment.baseUrl}${EventService.eventsEndpoint}/sessions/?readableEventId=${readableEventId}`
        );
    }

    public getSessionTracks(readableEventId: string): Observable<SessionTrack[]> {
        return this.http.get<SessionTrack[]>(
            `${environment.baseUrl}${EventService.eventsEndpoint}/tracks/?readableEventId=${readableEventId}`
        );
    }

    public getSpeakers(readableEventId: string): Observable<Speaker[]> {
        return this.http.get<Speaker[]>(
            `${environment.baseUrl}${EventService.eventsEndpoint}/speakers/?readableEventId=${readableEventId}`
        );
    }

    public getSponsors(readableEventId: string): Observable<Sponsorship[]> {
        return this.http.get<Sponsorship[]>(
            `${environment.baseUrl}${EventService.eventsEndpoint}/sponsors/?readableEventId=${readableEventId}`
        );
    }

    public getCaptcha(): Observable<Captcha> {
        return this.http.get<Captcha>(`${environment.baseUrl}${EventService.eventsEndpoint}/captcha/`);
    }

    public getCustomRegistrationFields(readableEventId: string): Observable<CustomRegistrationFieldModel.CustomRegistrationField[]> {
        // tslint:disable-next-line:max-line-length
        const url = `${environment.baseUrl}${EventService.eventsEndpoint}/customregistrationsfields/?readableEventId=${readableEventId}`;
        return this.http.get<CustomRegistrationFieldModel.CustomRegistrationField[]>(url);
    }

    public getEventRegistrationCount(readableEventId: string): Observable<number> {
        return this.http.get<number>(
            `${environment.baseUrl}${EventService.eventsEndpoint}/registrationcount/?readableEventId=${readableEventId}`
        );
    }

    public registerToEvent(readableEventId: string, registrationData: RegistrationData): Observable<RegistrationResult> {
        const url = `${environment.baseUrl}${EventService.eventsEndpoint}/register/?readableEventId=${readableEventId}`;
        return this.http.post<RegistrationResult>(url, registrationData);
    }

    public finalizeRegistration(readableEventId: string, requestData: FinalizeRegistrationRequest): Observable<RegistrationResult> {
        const url = `${environment.baseUrl}${EventService.eventsEndpoint}/finalizeregistration/?readableEventId=${readableEventId}`;
        return this.http.post<RegistrationResult>(url, requestData);
    }

    public getSessionsInATrack(trackId: String): Observable<Session[]> {
        return this.http.get<Session[]>(`${environment.baseUrl}${EventService.tracksEndpoint}/sessions/?trackId=${trackId}`);
    }
}
