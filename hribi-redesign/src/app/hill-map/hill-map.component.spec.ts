import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HillMapComponent } from './hill-map.component';

describe('HillMapComponent', () => {
  let component: HillMapComponent;
  let fixture: ComponentFixture<HillMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HillMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HillMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
