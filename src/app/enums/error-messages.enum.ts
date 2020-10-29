export enum ErrorMessagesCode {
  NoError = 0,
  InvalidModel = 1,
  EntityNotFound = 3,
  NothingChanged = 4,

  // Auth
  WrongAuthData = 10,
  LoginAlreadyTaken = 11,
  EmailAlreadyTaken = 12,

  // Rooms
  DomainAlreadyTaken = 20,
  RoomNotFound = 21,
  RoomAccessError = 22,

  // Tests
  TestNotFound = 30,

  // Users
  UserNotFound = 40,
}

export enum ErrorMessagesText {
  InvalidModel = 'Неверная модель',
  EntityNotFound = 'Сущность не найдена',
  NothingChanged = 'Ничего не изменилось',

  // Auth
  WrongAuthData = 'Неверные данные аутентификации',
  LoginAlreadyTaken = 'Логин уже занят',
  EmailAlreadyTaken = 'Email уже занят',

  // Rooms
  DomainAlreadyTaken = 'Домен уже занят',
  RoomNotFound = 'Комната не найдена',
  RoomAccessError = 'Ошибка доступа к комнате',

  // Tests
  TestNotFound = 'Тест не найден',

  // Users
  UserNotFound = 'Пользователь не найден',
}
