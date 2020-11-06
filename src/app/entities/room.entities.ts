export class GetRoomsItem {
  id: string;
  name: string;
  domain: string;
  ownerId: string;
  isActive: boolean;
  isApproveManually: boolean;
  isRegistrationEnabled: boolean;
}

export class Room {
  name: string;
  domain: string;
  ownerId: string;
  fields: RoomField[];
  isActive: boolean;
  isApproveManually: boolean;
  isRegistrationEnabled: boolean;
}

export class RoomField {
  name: string;
  type: FieldType;
  isRequired: boolean;
  placeholder: string = null;
  mask: string = null;

  options?: string[];
}

export enum FieldType {
  Input = 1,
  Select = 2,
}

class Member {
  token: string;
  login: string;
  attempts: Attempt[];
  UserData: any;
}

class Attempt {
  testId: string;
  sectionId: number;
  questionId: number;
  answer: any;
}
