import { TestBed } from '@angular/core/testing';

import { FoodserviceService } from './foodservice.service';

describe('FoodserviceService', () => {
  let service: FoodserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
