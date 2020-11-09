import { ErrorMessagesCode } from '../enums/error-messages.enum';

export class Response<TData> {
  constructor(response: Response<TData>) {
    Object.assign(this, response);
  }

  succeeded: boolean = false;
  errorMessageCode: ErrorMessagesCode = 0;
  data: TData = null;
}
