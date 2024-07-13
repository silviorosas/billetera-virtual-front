import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrDecoderComponent } from './qr-decoder.component';

describe('QrDecoderComponent', () => {
  let component: QrDecoderComponent;
  let fixture: ComponentFixture<QrDecoderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrDecoderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QrDecoderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
