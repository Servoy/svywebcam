import { Component, Input, SimpleChanges, Renderer2, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { ServoyBaseComponent } from '@servoy/public';
import {Subject, Observable} from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';


@Component({
    selector: 'svywebcam-webcam',   // means can drop this template in a parent template using the <svywebcam-webcam> tag
    templateUrl: './webcam.html'
})
export class Webcam extends ServoyBaseComponent<HTMLDivElement>{

    // Model Input
    @Input() styleClass: string;
    @Input() options: object;

    // Handler Input
    @Input() getBase64Data: (data: string) => void;

    /* 
    * READ ME
    *
    * NG1 OPTIONS
    * -------------------------------------------------------------------------------------------
    * The library jpeg_camera used in the former NG1 component had several options. Specifically:
    * 
    * mirror : true|false defines if the image captured should be mirrored
    * quality: 0-1 the quality of the image capture
    * retry_success: true|false if true will try again to upload the image in case of failure
    * scale: 1 scale the captured image with the given scale
    * optShutter: true|false if true the capture will play a shutter sound
    * optShutter_ogg_url: ogg url for the shutter sound
    * optShutter_ogg_url: mp3 url for the shutter sound
    * optSwf_url: 
    * optTimeout: timeout the timeout to be used for the image upload (https://github.com/amw/jpeg_camera#usage)
    * 
    * NG2 OPTIONS
    * -------------------------------------------------------------------------------------------
    * The NG2 implementation is based on top of the ngx_webcam (https://www.npmjs.com/package/ngx-webcam)
    * Options aren't an exact match with the former NG1 component.
    * The shutter sound has yet to be implemented. Some options are simply not applicable (retry_success, timeout), while some other options (mirror, scale) behave slightly differently 
    * 
    * mirror: string | WebcamMirrorProperties: Flag to control image mirroring. If the attribute is missing or null and the camera claims to be user-facing, the image will be mirrored (x-axis) to provide a better user experience (" selfie view"). A string value of "never" will prevent mirroring, whereas a value of "always" will mirror every camera stream, even if the camera cannot be detected as user-facing. For future extensions, the WebcamMirrorProperties object can also be used to set these values.
    * shutter* : shutter sound should be implemented separetly.
    * scale: using the aspectRatio (https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/aspectRatio) from videoOptions: MediaTrackConstraints: Defines constraints (MediaTrackConstraints) to apply when requesting the video track.
    * retry_success: deprecated since there is no upload to Web API
    * timeout : deprecated since there is no upload to Web API
    */
    
    // scope property not in model
    public width;                           // width
    public height;                          // height

    public optMirror = "never";                 // mirror (mirrorImage: string | WebcamMirrorProperties: Flag to control image mirroring. If the attribute is missing or null and the camera claims to be user-facing, the image will be mirrored (x-axis) to provide a better user experience (" selfie view"). A string value of "never" will prevent mirroring, whereas a value of "always" will mirror every camera stream, even if the camera cannot be detected as user-facing. For future extensions, the WebcamMirrorProperties object can also be used to set these values.)
    public optQuality = 1;                      // capture quality (imageQuality: number = 0.92: Image quality to use when capturing snapshots. Must be a number between 0..1. Default is 0.92.)
    public optScale = 1;                        // scale of image https://github.com/amw/jpeg_camera/blob/master/dist/jpeg_camera.js#L720
    // public optRetrySuccess = false;          // deprecated. Retries the upload in case of failure
    // public optShutter = false;               // TODO use a shutter sound
    // public optShutter_ogg_url = '';          // TODO audio location
    // public optShutter_mp3_url = '';          // TODO audio location
    // public optSwf_url = '';                 
    // public optTimeout = 0;                   // deprecated. Timeout was used for upload in jpeg_camera.

    // TODO expose facindMode and other MediaTrackConstraints
    public videoOptions: MediaTrackConstraints = {
        // width: {ideal: 1024},
        // height: {ideal: 576}
        // aspectRatio: {ideal: 4/3}
    };

    // Scope variables & objects
    public errorAccessDenied = false;
    public errors: WebcamInitError[] = [];

    resizeObserver: ResizeObserver;

    // webcam snapshot trigger
    private trigger: Subject<void> = new Subject<void>();

    constructor(protected readonly renderer: Renderer2, protected cdRef: ChangeDetectorRef) {
         super(renderer, cdRef);
    }

    // Note: to hook in the svyXxx methods the Component should know how to resolve the element. Add the #element in the target element tag of your template.
    // Example: <div [id]="servoyApi.getMarkupId()" #element >
    svyOnInit() {
        super.svyOnInit();

        // listen for resize to adjust height & width
        this.resizeObserver = new ResizeObserver(() => {
            this.height = this.elementRef.nativeElement.clientHeight;
            this.width = this.elementRef.nativeElement.clientWidth;
          });
        this.resizeObserver.observe(this.elementRef.nativeElement);

        // set default width/height on init
        this.width = this.elementRef.nativeElement.clientWidth;
        this.height = this.elementRef.nativeElement.clientHeight;
    }
    
    svyOnChanges( changes: SimpleChanges ) {
        if (changes) {
            // react upon model changes
            for (const property of Object.keys(changes)) {
                switch (property) {
                    case 'options':             // refresh options when option object is changed
                        this.refreshOptions();
                        break;
                }
            }
        }

        super.svyOnChanges(changes);
    }

    ngOnDestroy() {
        // unobserve the resize handler
        this.resizeObserver.unobserve(this.elementRef.nativeElement);
    }

    public handleCapture(webcamImage: WebcamImage): void {

        // get the image as DataUrl
        var imgUrl = webcamImage.imageAsDataUrl;

        // if there is an handler, call the handler function getBase64Data
        if (this.getBase64Data) {
            this.getBase64Data(imgUrl);
        }
    }

    public get triggerObservable(): Observable<void> {
        // trigger an observable to capture a picture
        return this.trigger.asObservable();
    }

    public handleInitError(error: WebcamInitError): void {

        // TODO can i catch the user enabling the camera and activate it without refresh ?.
        // User requires to refresh the page if the camera permissions are enabled/disabled

        // check if user has allowed camera permission
        if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
            // show message User Access Denied
            console.warn("Camera access was not allowed by user!");
            this.errors = [];
            this.errorAccessDenied = true;
        } else {
            // show unexpected errors
            this.errors.push(error);
            this.errorAccessDenied = false;
        }
      }

    private refreshOptions() {

        // refresh the options which have been modified by the server side function setOptions(options)
        if (this.options) {
            this.optMirror = this.options['mirror'] ? "always" : "never";
            this.optQuality = this.options['quality'] ? this.options['quality'] : 1;

            // set aspectRatio https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/aspectRatio
            if (this.options['scale']) {
                this.videoOptions = {
                    aspectRatio: {ideal: this.options['scale']}
                };
            } else {
                delete this.videoOptions.aspectRatio;
            }
			if (['environment','user'].includes(this.options['facingMode'])) {
				this.videoOptions.facingMode = { ideal: this.options['facingMode']};
			} else {
				delete this.videoOptions.facingMode;
			}
        } else {
            // reset to default
            this.optMirror = "never";
            this.optQuality = 1;
            delete this.videoOptions.aspectRatio;
			delete this.videoOptions.facingMode;
        }

    }

    /* Web Component API */

    capture() {
        this.trigger.next();
    }    
}