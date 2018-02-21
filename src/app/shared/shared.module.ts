import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CapitalcasePipe } from './pipes/capitalcase.pipe';
import { CommaSeparateWholePipe } from './pipes/comma-separate-whole.pipe';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [
        CapitalcasePipe,
        CommaSeparateWholePipe,
        ReactiveFormsModule,
        CommonModule
    ],
    declarations: [
        CapitalcasePipe,
        CommaSeparateWholePipe
    ]
})
export class SharedModule { }
