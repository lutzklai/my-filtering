import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilterPageComponent } from './components/filter-page/filter-page.component';
import { FilterDisplayComponent } from './components/filter-display/filter-display.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { FiltersComponent } from './components/filters/filters.component';
import { SharedModule } from '../shared/shared.module';
import { CarDataGuard } from './guards/car-data.guard';

const routes: Routes = [
    {
        path: 'filter',
        component: FilterPageComponent,
        canActivate: [ CarDataGuard ]
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: [
        FilterPageComponent,
        FilterDisplayComponent,
        ItemListComponent,
        FiltersComponent
    ],
    providers: [
        CarDataGuard
    ]
})
export class FilterModule { }
