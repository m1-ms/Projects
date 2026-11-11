import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chefs } from './chefs';

describe('Chefs', () => {
  let component: Chefs;
  let fixture: ComponentFixture<Chefs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chefs],
    }).compileComponents();

    fixture = TestBed.createComponent(Chefs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
