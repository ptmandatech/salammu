import { TestBed } from '@angular/core/testing';

import { PresencesService } from './presences.service';

describe('PresencesService', () => {
  let service: PresencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PresencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
