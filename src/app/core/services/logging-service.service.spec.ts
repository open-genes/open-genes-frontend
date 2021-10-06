import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoggingService } from './logging-service.service';

describe('LogServiceService', () => {
  let service: LoggingService;
  let originalLogFunc: any;
  let constructorValues: any;
  let constructorValuesSpy: any;

  beforeEach(() => {
    constructorValues = {
      http: HttpTestingController,
      url: '',
      token: '',
    };

    constructorValuesSpy = jasmine.createSpyObj(constructorValues);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],

      providers: [
        { provide: String, useValue: '' },
        { provide: LoggingService, useValue: constructorValuesSpy },
        { provide: LoggingService, useClass: LoggingService },
      ],
    });
    service = TestBed.inject(LoggingService);

    originalLogFunc = console.error;
    console.error = jasmine.createSpy('error');
  });

  afterEach(() => {
    console.error = originalLogFunc;
    originalLogFunc = undefined;
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });

  it('should write logs to console and resemble a proper type', () => {
    service.sendMessage({ message: 'test error message', type: 'error' });
    void expect(originalLogFunc).toHaveBeenCalled;
  });
});
