import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HausDetail } from './haus-detail';

describe('HausDetail', () => {
  let component: HausDetail;
  let fixture: ComponentFixture<HausDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HausDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HausDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
