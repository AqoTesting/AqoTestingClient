import { ErrorMessagesCode } from '../enums/error-messages.enum';

export class Response<TData> {
  constructor() {}

  succeeded: boolean;
  errorMessageCode: ErrorMessagesCode;
  data: TData;
}