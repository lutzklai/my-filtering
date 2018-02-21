import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { publishReplay, refCount } from 'rxjs/operators';

import { FilterService } from '../../services/filter.service';
import { GetCarAPI } from '../../models/cars.model';
import { FilteredDataAndPagination } from '../../models/filtered-data.model';

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.less']
})
export class ItemListComponent implements OnInit {
    data$: Observable<FilteredDataAndPagination>;

    constructor(
        private filterService: FilterService
    ) { }

    ngOnInit() {
        this.data$ = this.filterService.getFilteredData().pipe(
            // use publishReplay + refCount to share observable across multiple async pipes
            publishReplay(1),
            refCount()
        );
    }

}
