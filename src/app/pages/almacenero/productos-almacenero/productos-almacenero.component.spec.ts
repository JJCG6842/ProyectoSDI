import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosAlmaceneroComponent } from './productos-almacenero.component';

describe('ProductosAlmaceneroComponent', () => {
  let component: ProductosAlmaceneroComponent;
  let fixture: ComponentFixture<ProductosAlmaceneroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosAlmaceneroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosAlmaceneroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
