import { ErrorMessagesCode } from '../enums/error-messages.enum';

export class Response<TData> {
  constructor(response: Response<any> = null) {
    if (response) {
      this.succeeded = response.succeeded;
      this.errorMessageCode = response.errorMessageCode;
      this.data = response.data;
    }
  }

  succeeded: boolean = false;
  errorMessageCode: ErrorMessagesCode = 0;
  data: TData = null;
}
