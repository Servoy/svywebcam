import { Component, ChangeDetectionStrategy, Input, SimpleChanges, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServoyBaseComponent } from '@servoy/public';
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil, WebcamModule } from 'ngx-webcam';

@Component({
    selector: 'svywebcam-webcam',
    templateUrl: './webcam.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, WebcamModule],
})
export class Webcam extends ServoyBaseComponent<HTMLDivElement> implements OnDestroy {

    @Input() styleClass!: string;
    @Input() options: any;

    @Input() getBase64Data!: (data: string) => void;

    readonly width = signal<number>(0);
    readonly height = signal<number>(0);

    readonly optMirror = signal('never');
    readonly optQuality = signal(1);
    public optScale = 1;

    readonly videoOptions = signal<MediaTrackConstraints>({});

    readonly errorAccessDenied = signal(false);
    readonly errors = signal<WebcamInitError[]>([]);

    private resizeObserver!: ResizeObserver;

    readonly showWebCam = signal(true);

    availableDevicesId: string[] = [];
    private switchCamera: Subject<boolean | string> = new Subject<boolean | string>();

    private trigger: Subject<void> = new Subject<void>();

    svyOnInit() {
        super.svyOnInit();

        this.resizeObserver = new ResizeObserver(() => {
            this.height.set(this.elementRef()!.nativeElement.clientHeight);
            this.width.set(this.elementRef()!.nativeElement.clientWidth);
        });
        this.resizeObserver.observe(this.elementRef()!.nativeElement);

        this.width.set(this.elementRef()!.nativeElement.clientWidth);
        this.height.set(this.elementRef()!.nativeElement.clientHeight);
        this.getAvailableVideoInputsId();
    }

    svyOnChanges(changes: SimpleChanges) {
        if (changes) {
            for (const property of Object.keys(changes)) {
                switch (property) {
                    case 'options':
                        this.refreshOptions();
                        break;
                }
            }
        }

        super.svyOnChanges(changes);
    }

    ngOnDestroy() {
        this.resizeObserver?.unobserve(this.elementRef()?.nativeElement);
    }

    public handleCapture(webcamImage: WebcamImage): void {
        const imgUrl = webcamImage.imageAsDataUrl;

        if (this.getBase64Data) {
            this.getBase64Data(imgUrl);
        }
    }

    public get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
    }

    public handleInitError(error: WebcamInitError): void {
        if (error.mediaStreamError && error.mediaStreamError.name === 'NotAllowedError') {
            console.warn('Camera access was not allowed by user!');
            this.errors.set([]);
            this.errorAccessDenied.set(true);
        } else {
            this.errors.update(e => [...e, error]);
            this.errorAccessDenied.set(false);
        }
    }

    private refreshOptions() {
        this.showWebCam.set(false);
        if (this.options) {
            this.optMirror.set(this.options['mirror'] ? 'always' : 'never');
            this.optQuality.set(this.options['quality'] ? this.options['quality'] : 1);

            const opts: MediaTrackConstraints = {};
            if (this.options['scale']) {
                opts.aspectRatio = { ideal: this.options['scale'] };
            }
            if (['environment', 'user'].includes(this.options['facingMode'])) {
                opts.facingMode = { ideal: this.options['facingMode'] };
            }
            this.videoOptions.set(opts);
        } else {
            this.optMirror.set('never');
            this.optQuality.set(1);
            this.videoOptions.set({});
        }
        setTimeout(() => {
            this.showWebCam.set(true);
        });
    }

    public get switchCameraObservable(): Observable<boolean | string> {
        return this.switchCamera.asObservable();
    }

    private async getAvailableVideoInputsId(): Promise<void> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const mediaDevices = await WebcamUtil.getAvailableVideoInputs();
            this.availableDevicesId = mediaDevices.map(device => device.deviceId);
            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            console.warn('Failed to get video inputs:', error);
            this.availableDevicesId = [];
        }
    }

    capture() {
        this.trigger.next();
    }

    getDevicesId(): string[] {
        return this.availableDevicesId;
    }

    setDeviceId(deviceId: string): void {
        this.switchCamera.next(deviceId);
    }
}
