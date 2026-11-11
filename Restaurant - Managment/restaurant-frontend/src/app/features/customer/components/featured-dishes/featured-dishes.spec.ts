import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturedDishes } from './featured-dishes';

describe('FeaturedDishes', () => {
  let component: FeaturedDishes;
  let fixture: ComponentFixture<FeaturedDishes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedDishes],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedDishes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
