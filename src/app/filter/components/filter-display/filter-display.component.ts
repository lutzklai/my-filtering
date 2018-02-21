import { Component, OnInit } from '@angular/core';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { FilterService } from '../../services/filter.service';

@Component({
    selector: 'app-filter-display',
    templateUrl: './filter-display.component.html',
    styleUrls: ['./filter-display.component.less']
})
export class FilterDisplayComponent implements OnInit {
    filterItems$: Observable<{
        type: string;
        text: string;
    }[]>;

    constructor(
        private filterService: FilterService
    ) { }

    ngOnInit() {
        this.filterItems$ = this.filterService.getFilters().pipe(
            map(res => {
                let filterItems = [];

                // Build year filters
                if (res.year.from !== null && res.year.to !== null) {
                    filterItems.push({
                        type: 'year',
                        text: 'Year: ' + res.year.from + '-' + res.year.to
                    });
                } else if (res.year.from !== null && res.year.to === null) {
                    filterItems.push({
                        type: 'year',
                        text: 'Year: >= ' + res.year.from
                    });
                } else if (res.year.from === null && res.year.to !== null) {
                    filterItems.push({
                        type: 'year',
                        text: 'Year: <= ' + res.year.to
                    });
                }

                // Build hp filters
                if (res.hp.from !== null && res.hp.to !== null) {
                    filterItems.push({
                        type: 'hp',
                        text: 'HP: ' + res.hp.from + '-' + res.hp.to
                    });
                } else if (res.hp.from !== null && res.hp.to === null) {
                    filterItems.push({
                        type: 'hp',
                        text: 'HP: >= ' + res.hp.from
                    });
                } else if (res.hp.from === null && res.hp.to !== null) {
                    filterItems.push({
                        type: 'hp',
                        text: 'HP: <= ' + res.hp.to
                    });
                }

                // Build mpg filters
                if (res.mpg.from !== null && res.mpg.to !== null) {
                    filterItems.push({
                        type: 'mpg',
                        text: 'MPG: ' + res.mpg.from + '-' + res.mpg.to
                    });
                } else if (res.mpg.from !== null && res.mpg.to === null) {
                    filterItems.push({
                        type: 'mpg',
                        text: 'MPG: >= ' + res.mpg.from
                    });
                } else if (res.mpg.from === null && res.mpg.to !== null) {
                    filterItems.push({
                        type: 'mpg',
                        text: 'MPG: <= ' + res.mpg.to
                    });
                }

                // Build cylinder filter
                if (res.cyl !== null) {
                    filterItems.push({
                        type: 'cyl',
                        text: 'Cylinders: ' + res.cyl
                    });
                }

                // Build lbs filter
                if (res.lbs.from !== null && res.lbs.to !== null) {
                    filterItems.push({
                        type: 'lbs',
                        text: 'Weight: ' + res.lbs.from + '-' + res.lbs.to + ' lbs'
                    });
                } else if (res.lbs.from !== null && res.lbs.to === null) {
                    filterItems.push({
                        type: 'lbs',
                        text: 'Weight: >= ' + res.lbs.from + ' lbs'
                    });
                } else if (res.lbs.from === null && res.lbs.to !== null) {
                    filterItems.push({
                        type: 'lbs',
                        text: 'Weight: <= ' + res.lbs.to + ' lbs'
                    });
                }

                // Build acc filter
                if (res.acc.from !== null && res.acc.to !== null) {
                    filterItems.push({
                        type: 'acc',
                        text: 'Acceleration: ' + res.acc.from + '-' + res.acc.to + 's'
                    });
                } else if (res.acc.from !== null && res.acc.to === null) {
                    filterItems.push({
                        type: 'acc',
                        text: 'Acceleration: >= ' + res.acc.from + 's'
                    });
                } else if (res.acc.from === null && res.acc.to !== null) {
                    filterItems.push({
                        type: 'acc',
                        text: 'Acceleration: <= ' + res.acc.to + 's'
                    });
                }

                return filterItems;
            }),
            // use publishReplay + refCount to avoid unnecessarily running map logic for multiple async pipes
            publishReplay(1),
            refCount()
        )
    }

    /**
     * remove filter
     * @param type 
     */
    onFilterRemove(type: string) {
        this.filterService.removeFilter(type);
    }

}
