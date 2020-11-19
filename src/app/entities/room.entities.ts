
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
  constructor(room: Room) {
    Object.assign(this, room);
  }

  id: string;
  name: string;
  domain: string;
  description: string;
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
  placeholder!: string;
  mask!: string;

  options?: string[];
}

export enum FieldType {
  Input = 1,
  Select = 2,
}