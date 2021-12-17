import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Webcam } from './webcam';

describe('Webcam', () => {
  let component: Webcam;
  let fixture: ComponentFixture<Webcam>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Webcam ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Webcam);
    component = fixture.componentInstance;
    component.servoyApi =  jasmine.createSpyObj('ServoyApi', ['getMarkupId','trustAsHtml','registerComponent','unRegisterComponent']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
