import { TestBed } from '@angular/core/testing';

import { Discussion } from './discussion';

describe('Discussion', () => {
  let service: Discussion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Discussion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
