import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestDashboard } from './guestDashboard';

describe('GuestDashboard', () => {
  let component: GuestDashboard;
  let fixture: ComponentFixture<GuestDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
