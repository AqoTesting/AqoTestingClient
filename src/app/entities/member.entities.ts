import { Attempt } from './attempt.entities';

interface Dictionary<T> {
    [key: string]: T;
}

export class Member {
    id: string;
    roomId: string;
    login: string;
    email: string;
    isRegistered: boolean;
    isApproved: boolean;
    fields: Dictionary<string>;
    attempts: Attempt[];
}