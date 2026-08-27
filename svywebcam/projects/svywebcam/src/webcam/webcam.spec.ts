import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import { Component, Input } from '@angular/core';
import { Webcam } from './webcam';
import { ServoyPublicTestingModule } from '@servoy/public';
import { WebcamModule } from 'ngx-webcam';
import { Observable } from 'rxjs';

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  } as any;
});

@Component({ selector: 'webcam', template: '', standalone: true })
class MockWebcamComponent {
  @Input() trigger!: Observable<void>;
  @Input() width!: number;
  @Input() height!: number;
  @Input() imageQuality!: number;
  @Input() mirrorImage!: string;
  @Input() videoOptions!: MediaTrackConstraints;
  @Input() switchCamera!: Observable<boolean | string>;
}

describe('Webcam', () => {
  let component: Webcam;
  let fixture: ComponentFixture<Webcam>;

  beforeEach(async () => {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [] }),
        enumerateDevices: vi.fn().mockResolvedValue([]),
      },
      writable: true,
      configurable: true,
    });

    await TestBed.configureTestingModule({
      imports: [Webcam, ServoyPublicTestingModule],
    })
      .overrideComponent(Webcam, {
        remove: { imports: [WebcamModule] },
        add: { imports: [MockWebcamComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Webcam);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('servoyApi', {
      getMarkupId: vi.fn().mockReturnValue('test-id'),
      trustAsHtml: vi.fn(),
      registerComponent: vi.fn(),
      unRegisterComponent: vi.fn(),
      isInDesigner: vi.fn().mockReturnValue(false),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return a valid native element from getNativeElement()', () => {
    expect(component.getNativeElement()).not.toBeNull();
    expect(component.getNativeElement()).toBeInstanceOf(HTMLElement);
  });
});
