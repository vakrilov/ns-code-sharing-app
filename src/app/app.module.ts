import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { HomeComponent } from '@src/app/home/home.component';
import { WebOnlyComponent } from '@src/app/web-only/web-only.component';
import { PlatSpecificComponent } from '@src/app/plat-specific/plat-specific.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebOnlyComponent,
    PlatSpecificComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
