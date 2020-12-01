export enum ErrorMessagesCode {
  // Common
  NoError = 0,
  InvalidModel = 1,
  EntityNotFound = 3,

  // Auth
  WrongAuthData = 100,
  LoginAlreadyTaken = 101,
  EmailAlreadyTaken = 102,

  // Rooms
  RoomNotFound = 200,
  RoomAccessError = 201,

  DomainAlreadyTaken = 202,

  RoomRegistrationEnabled = 203,

  // Tests
  TestNotFound = 300,
  TestAccessError = 301,

  SectionNotFound = 302,
  QuestionNotFound = 303,

  NotEnoughSections = 304,
  NotEnoughQuestions = 305,

  SingleChoiceWrongCorrectsCount = 306,

  EmptyOption = 307,
  EmptyQuestion = 308,

  NoAttemptsLeft = 309,

  TestIsNotActive = 310,

  // Users
  UserNotFound = 400,

  // Members
  MemberNotFound = 500,
  MemberAccessError = 501,

  MemberAlreadyRegistered = 502,

  FieldNotPassed = 503,
  FieldRegexMismatch = 504,
  FieldOptionNotInList = 505,

  FieldsAlreadyExists = 506,

  MemberIsNotApproved = 507,
  MemberIsApproved = 508,

  MemberIsNotRegistered = 509,
  MemberIsRegistered = 510,

  HasNoActiveAttempt = 511,
  HasActiveAttempt = 512,

  // Attempts
  AttemptNotFound = 600,
  AttemptAccessError = 601,

  SelectedOptionOutOfRange = 602,
  WrongOptionsCount = 603,
  NonUniqueOption = 604,
  TimeIsUp = 605,
}

export enum ErrorMessagesText {
  InvalidModel = 'Неверная модель',
  EntityNotFound = 'Сущность не найдена',

  // Auth
  WrongAuthData = 'Неверные данные авторизации',
  LoginAlreadyTaken = 'Логин занят',
  EmailAlreadyTaken = 'Email занят',

  // Rooms
  RoomNotFound = 'Комната не найдена',
  RoomAccessError = 'Ошибка доступа к комнате',

  DomainAlreadyTaken = 'Комната с таким доменом уже существует',

  RoomRegistrationEnabled = 'Регистрация в комнате включена',

  // Tests
  TestNotFound = 'Тест не найден',
  TestAccessError = 'Ошибка доуступа к тесту',

  SectionNotFound = 'Раздел не найден',
  QuestionNotFound = 'Вопрос не найден',

  NotEnoughSections = 'Количество выдаваемых секций больше количества секций в вопросе',
  NotEnoughQuestions = 'Количество выдаваемых вопросов больше количества вопросов в секции',

  SingleChoiceWrongCorrectsCount = 'Неверное количество верных ответов',

  EmptyOption = 'В варианте ответа нет ни текста, ни картинки',
  EmptyQuestion = 'В вопросе нет ни текста, ни картинки',

  NoAttemptsLeft = 'Попыток не осталось',

  TestIsNotActive = 'Тест не активен',

  // Users
  UserNotFound = 'Пользователь не найден',

  // Members
  MemberNotFound = 'Участник не найден',
  MemberAlreadyExists = 'Участник уже существует',
  MemberAccessError = 'Ошибка доступа к участнику',

  MemberAlreadyRegistered = 'Участник с такими данными полей уже зарегистрирован',

  FieldNotPassed = 'Не все поля заполнены',

  FieldRegexMismatch = 'Введённое значение поля не соответствует маске',
  FieldOptionNotInList = 'Переданного значения поля нет в списке вариантов',

  FieldsAlreadyExists = 'Участник с такими данными полей уже зарегистрирован',

  MemberIsNotApproved = 'Участник не подтверждён',
  MemberIsApproved = 'Участник подтверждён',

  MemberIsNotRegistered = 'Участник не зарегистрирован',
  MemberIsRegistered = 'Участник зарегистрирован',

  HasNoActiveAttempt = 'Нет активной попытке',
  HasActiveAttempt = 'Уже есть актвная попытка',

  // Attempts
  AttemptNotFound = 'Попытка не найдена',
  AttemptAccessError = 'Ошибка доступа к попытке',

  SelectedOptionOutOfRange = 'Переданное количество выбранных вариантов больше количества вариантов в вопросе',
  WrongOptionsCount = 'Количество переданных элементов последовательности не соответствует количеству элементов последовательности в вопросе',
  NonUniqueOption = 'Переданы дублирующиеся варианты ответа',
  
  TimeIsUp = 'Время прохождения теста истекло',
}