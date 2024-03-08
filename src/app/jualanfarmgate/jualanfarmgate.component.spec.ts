import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JualanfarmgateComponent } from './jualanfarmgate.component';

describe('JualanfarmgateComponent', () => {
  let component: JualanfarmgateComponent;
  let fixture: ComponentFixture<JualanfarmgateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JualanfarmgateComponent]
    });
    fixture = TestBed.createComponent(JualanfarmgateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
