import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

type LogInput = Omit<LogMessage, 'token' | 'environment'>;

interface LogMessage {
  message: string;
  type?: 'info' | 'warning' | 'error';
  token: string;
  environment?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  constructor(private http: HttpClient) {
    this.url = environment.loggerUrl;
    this.token = environment.loggerToken;
  }

  private url: string;
  private token: string;

  public sendMessage(log: LogInput): void {
    const req: LogMessage = {
      message: log.message,
      type: log?.type ? log.type : 'info',
      token: this.token,
      environment: environment.name,
    };

    if (this.url.length !== 0 && this.token.length !== 0) {
      this.http.post(this.url, req);
    } else {
      switch (log.type) {
        case 'warning':
          console.warn(req);
          break;
        case 'error':
          console.error(req);
          break;
        case 'info':
          console.log(req);
          break;
        default:
          console.log(req);
      }
    }
  }
}
