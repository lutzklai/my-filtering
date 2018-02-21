import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { FilterService } from '../../services/filter.service';

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.less']
})
export class FiltersComponent implements OnInit, OnDestroy {
    filterHidden = {
        year: true,
        hp: true,
        mpg: true,
        cyl: true,
        lbs: true,
        acc: true
    };
    form: FormGroup;
    formSubscription: Subscription;

    constructor(
        private filterService: FilterService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.formSubscription = this.filterService.getFilters()
            .pipe(
                // only grab the filters on load
                first()
            )
            .subscribe(res => {
                // build form based on stored filters
                // TODO - add form validators
                this.form = this.fb.group({
                    year: this.fb.group({
                        from: [res.year.from, ''],
                        to: [res.year.to, '']
                    }),
                    hp: this.fb.group({
                        from: [res.hp.from, ''],
                        to: [res.hp.to, '']
                    }),
                    mpg: this.fb.group({
                        from: [res.mpg.from, ''],
                        to: [res.mpg.to, '']
                    }),
                    cyl: [res.cyl, ''],
                    lbs: this.fb.group({
                        from: [res.lbs.from, ''],
                        to: [res.lbs.to, '']
                    }),
                    acc: this.fb.group({
                        from: [res.acc.from, ''],
                        to: [res.acc.to, '']
                    })
                });
            });
    }

    ngOnDestroy(){
        if(this.formSubscription){
            this.formSubscription.unsubscribe();
        }
    }

    /**
     * Form submit event for new filters
     */
    onFilterSubmit(){
        if(this.form.value.cyl === 'any'){
            // if any is selected, set to null for filter service
            this.form.value.cyl = null
        }else if(this.form.value.cyl !== null){
            // if other option is selected cast to number
            this.form.value.cyl = Number(this.form.value.cyl);
        }

        this.filterService.applyFilters(this.form.value);
    }

    /**
     * clear form
     */
    onClearForm(){
        this.form.reset();
    }
}
