import { Image } from "./Image";

export interface Sponsorship {
    description: string;
    id: string;
    image: Image;
    sponsorId: string;
    sponsorName: string;
    sponsorshipTopic: string;
}