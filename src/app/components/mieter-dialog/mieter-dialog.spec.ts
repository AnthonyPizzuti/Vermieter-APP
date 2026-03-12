import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MieterDialog } from './mieter-dialog';

describe('MieterDialog', () => {
  let component: MieterDialog;
  let fixture: ComponentFixture<MieterDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MieterDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MieterDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
