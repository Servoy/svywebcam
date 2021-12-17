import { Component, Input, SimpleChanges, Renderer2, ChangeDetectorRef } from '@angular/core';
import { ServoyBaseComponent } from '@servoy/public';

@Component({
    selector: 'svywebcam-webcam',
    templateUrl: './webcam.html'
})
export class Webcam extends ServoyBaseComponent<HTMLDivElement>{

    constructor(protected readonly renderer: Renderer2, protected cdRef: ChangeDetectorRef) {
         super(renderer, cdRef);
    }
    
    svyOnInit() {
        super.svyOnInit();
    }
    
    svyOnChanges( changes: SimpleChanges ) {
        super.svyOnChanges(changes);
    }
    
}