export class GetRoomsItem {
  id: string;
  name: string;
  domain: string;
  ownerId: string;
  isDataRequired: boolean;
  isActive: boolean;
}

export class CreateRoom {
  name: string;
  domain: string;

  isActive: boolean = false;
  isRegistrationAllowed: boolean = true;
  isCheckManually: boolean = false;

  description: string;
  fields: UserRoomField[];
}

class UserRoomField {
  name: string;
  type: FieldType;
  isRequired: boolean;

  options?: string[];
}

enum FieldType {
  Input = 1,
  Select = 2,
}

export class GetRoom {
  id: string;
  name: string;
  domain: string;
  members: Member[];
  testIds: string[];
  ownerId: string;
  isDataRequired: boolean;
  requestedFields: RequestedField[];
  isActive: boolean;
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

class RequestedField {
  key: string;
  name: string;
  placeholder?: string;
  isRequired: boolean;
  isShowTable: boolean;
}
