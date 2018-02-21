import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { shareReplay, map, switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';

import { FilterObject } from '../models/filters.model';
import { GetCarAPI } from '../models/cars.model';
import { FilteredDataAndPagination } from '../models/filtered-data.model';

const PAGINATION_COUNT = 12; // amount of items that can be displayed on a page at a given time

@Injectable()
export class FilterService {
    private data$: Observable<GetCarAPI[]>;
    private filteredData$: Observable<FilteredDataAndPagination>;
    private filters$: Observable<FilterObject>;

    constructor(
        private http: HttpClient,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    /**
     * Get cars json data
     */
    getData(): Observable<GetCarAPI[]> {
        if (!this.data$) {
            this.data$ = this.http.get<GetCarAPI[]>('/assets/data/cars.json')
                .pipe(
                    map(res => {
                        res.forEach(item => {
                            // sanitize year data so it includes century
                            item.year = Number('19' + item.year);
                        })
                        return res;
                    }),
                    // use shareReplay so the data is only retrieved once and reused
                    shareReplay()
                );
        }

        return this.data$;
    }

    /**
     * Get filters
     */
    getFilters(): Observable<FilterObject> {
        if(!this.filters$) {
            this.filters$ = this.activatedRoute.queryParams
            .pipe(
                map(queryParams => {
                    // sanitize query params to numbers
                    const filterObject = {
                        year: {
                            from: isNaN(queryParams.yearFrom) ? null : Number(queryParams.yearFrom),
                            to: isNaN(queryParams.yearTo) ? null : Number(queryParams.yearTo)
                        },
                        hp: {
                            from: isNaN(queryParams.hpFrom) ? null : Number(queryParams.hpFrom),
                            to: isNaN(queryParams.hpTo) ? null : Number(queryParams.hpTo)
                        },
                        mpg: {
                            from: isNaN(queryParams.mpgFrom) ? null : Number(queryParams.mpgFrom),
                            to: isNaN(queryParams.mpgTo) ? null : Number(queryParams.mpgTo)
                        },
                        cyl: isNaN(queryParams.cyl) ? null : Number(queryParams.cyl),
                        lbs: {
                            from: isNaN(queryParams.lbsFrom) ? null : Number(queryParams.lbsFrom),
                            to: isNaN(queryParams.lbsTo) ? null : Number(queryParams.lbsTo)
                        },
                        acc: {
                            from: isNaN(queryParams.accFrom) ? null : Number(queryParams.accFrom),
                            to: isNaN(queryParams.accTo) ? null : Number(queryParams.accTo)
                        }
                    };

                    return filterObject;
                })
            )
        }

        return this.filters$;
    }

    /**
     * Get filtered data
     */
    getFilteredData(): Observable<FilteredDataAndPagination> {
        if(!this.filteredData$){
            this.filteredData$ = this.getFilters().pipe(
                switchMap(filterObject => {
                    return forkJoin(
                        of(filterObject),
                        this.getData()
                    )
                }),
                map(([filterObject, data]) => {
                    // TODO - refactor so filter logic is not re-ran when only pagination properties update
                    let filteredData = this.filterCars(filterObject, data);

                    // total number of filtered items
                    const total = filteredData.length;
                    // determine if pagination is needed
                    const usePagination = total > PAGINATION_COUNT;

                    let displayRange = '', 
                        cars,
                        page = null,
                        pageParam = null,
                        isNext = false,
                        isPrev = false,
                        nextLink = [],
                        prevLink = [],
                        nextParams,
                        prevParams;

                    if(usePagination){
                        pageParam = this.activatedRoute.snapshot.queryParams.page;
                        // sanitize page value, if page is defined && is a number cast to number, else use 1
                        page = typeof pageParam !== 'undefined' && !isNaN(pageParam) ? Number(pageParam) : 1;
                        // if page is less than 1, set to 1
                        if(page < 1){
                            page = 1;
                        }
                        // if page is greater than last possible page, set to 1
                        if(page > Math.ceil(total / PAGINATION_COUNT)){
                            page = 1;
                        }
                        const isLastPage = page * PAGINATION_COUNT > total
                        isNext = !isLastPage;
                        isPrev = page > 1;

                        // if next is available determine next link
                        if(isNext){
                            nextLink = ['/filter'];
                            nextParams = {page: page + 1};
                        }
                        // if prev is available determine prev link
                        if(isPrev){
                            prevLink = ['/filter'];
                            prevParams = {page: page - 1};
                        }

                        // determine end rage value. If last page, end range could be somewhere between interval of PAGINATION_COUNT
                        const endRange = isLastPage ? total : ((page - 1) * PAGINATION_COUNT + PAGINATION_COUNT)
                        // build dispayRange string
                        displayRange = ((page - 1) * PAGINATION_COUNT + 1) + '-' + endRange;
                        cars = filteredData.splice((page - 1) * PAGINATION_COUNT, PAGINATION_COUNT);
                    }else{
                        cars = filteredData;
                    }
                    

                    return {
                        usePagination,
                        cars,
                        total,
                        page,
                        displayRange,
                        isNext,
                        isPrev,
                        nextLink,
                        prevLink,
                        nextParams,
                        prevParams
                    };
                })
            );
        }

        return this.filteredData$;
    }

    /**
     * Submit new filters
     * @param filters
     */
    applyFilters(filters: FilterObject) {
        let query = {
            yearFrom: filters.year.from,
            yearTo: filters.year.to,
            hpFrom: filters.hp.from,
            hpTo: filters.hp.to,
            mpgFrom: filters.mpg.from,
            mpgTo: filters.mpg.to,
            cyl: filters.cyl,
            lbsFrom: filters.lbs.from,
            lbsTo: filters.lbs.to,
            accFrom: filters.acc.from,
            accTo: filters.acc.to,
            page: 1 // reset page to 1
        };

        this.router.navigate(['/filter'], { queryParams: query });
    }

    /**
     * Remove filter
     * @param type 
     */
    removeFilter(type: string) {
        // clone queryParams object since queryParams is readonly
        let query = { ...this.activatedRoute.snapshot.queryParams };

        // unset query params based on type
        switch (type) {
            case 'year':
                query.yearFrom = null;
                query.yearTo = null;
                break;
            case 'hp':
                query.hpFrom = null;
                query.hpTo = null;
                break;
            case 'mpg':
                query.mpgFrom = null;
                query.mpgTo = null;
                break;
            case 'cyl':
                query.cyl = null;
                break;
            case 'lbs':
                query.lbsFrom = null;
                query.lbsTo = null;
                break;
            case 'acc':
                query.accFrom = null;
                query.accTo = null;
                break;
        }

        query.page = 1; // reset page to 1

        this.router.navigate(['filter'], { queryParams: query });
    }

    /**
     * method to perform filter on data
     * @param filterObject 
     * @param data 
     */
    private filterCars(filterObject: FilterObject, data: GetCarAPI[]){
        return data.filter(item => {

            // filter by year
            if(filterObject.year.from !== null && filterObject.year.to !== null){
                if(item.year < filterObject.year.from || item.year > filterObject.year.to) return false;
            }else if(filterObject.year.from !== null && filterObject.year.to === null){
                if(item.year < filterObject.year.from) return false;
            }else if(filterObject.year.from === null && filterObject.year.to !== null){
                if(item.year > filterObject.year.to) return false;
            }

            // filter by hp
            if(filterObject.hp.from !== null && filterObject.hp.to !== null){
                if(item.hp < filterObject.hp.from || item.hp > filterObject.hp.to) return false;
            }else if(filterObject.hp.from !== null && filterObject.hp.to === null){
                if(item.hp < filterObject.hp.from) return false;
            }else if(filterObject.hp.from === null && filterObject.hp.to !== null){
                if(item.hp > filterObject.hp.to) return false;
            }

            // filter by mpg
            if(filterObject.mpg.from !== null && filterObject.mpg.to !== null){
                if(item.mpg < filterObject.mpg.from || item.mpg > filterObject.mpg.to) return false;
            }else if(filterObject.mpg.from !== null && filterObject.mpg.to === null){
                if(item.mpg < filterObject.mpg.from) return false;
            }else if(filterObject.mpg.from === null && filterObject.mpg.to !== null){
                if(item.mpg > filterObject.mpg.to) return false;
            }

            // filter by cyl
            if(filterObject.cyl !== null){
                if(item.cyl !== filterObject.cyl) return false;
            }

            // filter by lbs
            if(filterObject.lbs.from !== null && filterObject.lbs.to !== null){
                if(item.lbs < filterObject.lbs.from || item.lbs > filterObject.lbs.to) return false;
            }else if(filterObject.lbs.from !== null && filterObject.lbs.to === null){
                if(item.lbs < filterObject.lbs.from) return false;
            }else if(filterObject.lbs.from === null && filterObject.lbs.to !== null){
                if(item.lbs > filterObject.lbs.to) return false;
            }

            // filter by acc
            if(filterObject.acc.from !== null && filterObject.acc.to !== null){
                if(item.acc < filterObject.acc.from || item.acc > filterObject.acc.to) return false;
            }else if(filterObject.acc.from !== null && filterObject.acc.to === null){
                if(item.acc < filterObject.acc.from) return false;
            }else if(filterObject.acc.from === null && filterObject.acc.to !== null){
                if(item.acc > filterObject.acc.to) return false;
            }

            // item passed all the filters
            return true;
        });
    }
}
