export enum ErrorMessagesCode {
  NoError = 0,
  InvalidModel = 1,
  EntityNotFound = 3,

  // Auth
  WrongAuthData = 100,
  LoginAlreadyTaken = 101,
  EmailAlreadyTaken = 102,

  // Rooms
  DomainAlreadyTaken = 200,
  RoomNotFound = 201,
  RoomAccessError = 202,
  RoomRegistrationEnabled = 203,

  // Tests
  TestNotFound = 300,

  // Users
  UserNotFound = 400,

  // Members
  MemberNotFound = 500,
  MemberAlreadyExists = 501,
  MemberAccessError = 502,

  FieldNotPassed = 503,
  FieldRegexMissmatch = 504,
  FieldOptionNotInList = 505,
  FieldsAlreadyExists = 506,

  MemberIsNotApproved = 507,
  MemberIsApproved = 508,

  MemberIsNotRegistered = 509,
  MemberIsRegistered = 510,

  RegistrationDisabled = 511,
  RegistrationEnabled = 512,
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
  RoomRegistrationEnabled = 'Регистрация в комнате включена',

  // Tests
  TestNotFound = 'Тест не найден',

  // Users
  UserNotFound = 'Пользователь не найден',

  // Members
  MemberNotFound = 'Участник не найден',
  MemberAlreadyExists = 'Участник уже существует',
  MemberAccessError = 'Ошибка доступа к участнику',

  FieldNotPassed = 'Не все поля заполнены',
  FieldRegexMissmatch = 'Несоответствие регулярного выражения поля',
  FieldOptionNotInList = 'Варианта поля нет в списке',
  FieldsAlreadyExists = 'Такой участник уже существует',

  MemberIsNotApproved = 'Участник не утвержден',
  MemberIsApproved = 'Участник подвержен ',

  MemberIsNotRegistered = 'Участник не зарегистрирован',
  MemberIsRegistered = 'Участник зарегистрирован',

  RegistrationDisabled = 'Регистрация выключена',
  RegistrationEnabled = 'Регистрация включена',
}
