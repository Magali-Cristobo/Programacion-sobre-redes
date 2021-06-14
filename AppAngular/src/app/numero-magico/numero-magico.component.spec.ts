import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumeroMagicoComponent } from './numero-magico.component';

describe('NumeroMagicoComponent', () => {
  let component: NumeroMagicoComponent;
  let fixture: ComponentFixture<NumeroMagicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumeroMagicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeroMagicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
