import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HillPageComponent } from './hill-page.component';

describe('HillPageComponent', () => {
  let component: HillPageComponent;
  let fixture: ComponentFixture<HillPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HillPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HillPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
