import { TestBed } from '@angular/core/testing';

import { NewspaperDataService } from './newspaper-data.service';

describe('NewspaperDataService', () => {
  let service: NewspaperDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewspaperDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
