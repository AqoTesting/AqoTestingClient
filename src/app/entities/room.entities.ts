export class GetRoomsItemDTO {
  id: string;
  name: string;
  domain: string;
  ownerId: string;
  isDataRequired: boolean;
  isActive: boolean;
}

export class GetRoomDTO {
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
