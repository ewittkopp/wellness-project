import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyCheckIn } from './daily-check-in';

describe('DailyCheckIn', () => {
  let component: DailyCheckIn;
  let fixture: ComponentFixture<DailyCheckIn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyCheckIn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyCheckIn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
