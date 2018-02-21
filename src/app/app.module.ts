import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { FilterModule } from './filter/filter.module';
import { FilterService } from './filter/services/filter.service';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FilterModule
    ],
    providers: [
        FilterService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
