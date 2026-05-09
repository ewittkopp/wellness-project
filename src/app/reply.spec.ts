import { TestBed } from '@angular/core/testing';

import { Reply } from './reply';

describe('Reply', () => {
  let service: Reply;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Reply);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
