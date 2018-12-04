import { Building } from './Building';
import { Room } from './Room';
import { Image } from "./Image";

export interface Event {
    autoregisterWaitlistItems: boolean;
    building: Building;
    description: string;
    endDate: Date;
    eventFormat: number;
    eventId: string;
    eventLanguage: number;
    eventName: string;
    eventType: number;
    image: Image;
    maxCapacity: number;
    publicEventUrl: string;
    readableEventId: string;
    room: Room;
    showAutomaticRegistrationCheckbox: boolean;
    showWaitlist: boolean;
    startDate: Date;
    timeZone: number;
    timeZoneName: string;
}