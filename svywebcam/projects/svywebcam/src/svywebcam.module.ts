import { Webcam } from './webcam/webcam';
import { WebcamModule } from 'ngx-webcam';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

 
@NgModule({
    declarations: [
		Webcam
    ],
    providers: [],
    imports: [
      WebcamModule,
      CommonModule,
      FormsModule
    ],
    exports: [
		Webcam
      ]
})
export class svywebcamModule {}
