export interface CustomRegistrationField {
    customRegistrationFieldId: string;
    text: string;
    type: number;
    isRequired: boolean;
    choices: string;
}

export enum Types {
    SimpleText = 100000000,
    Boolean = 100000001,
    MultipleChoice = 100000002,
    SingleChoice = 100000003
}
