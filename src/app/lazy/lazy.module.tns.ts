import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { LazyRoutingModule } from './lazy-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { LazyComponent } from './lazy/lazy.component';

@NgModule({
  declarations: [LazyComponent],
  imports: [
    LazyRoutingModule,
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class LazyModule { }
