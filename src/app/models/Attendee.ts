import { CustomRegistrationFieldResponse } from './CustomRegistrationFieldResponse';

export interface Attendee {
    firstName: string;
    lastName: string;
    email: string;
    passId: string;
    waitlisted: boolean;
    autoRegister: boolean;
    responses: CustomRegistrationFieldResponse[];
}