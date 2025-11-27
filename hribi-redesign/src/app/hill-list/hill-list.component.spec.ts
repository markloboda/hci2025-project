import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HillListComponent } from './hill-list.component';

describe('HillListComponent', () => {
  let component: HillListComponent;
  let fixture: ComponentFixture<HillListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HillListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
