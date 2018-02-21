import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'commaSeparateWhole'
})
export class CommaSeparateWholePipe implements PipeTransform {

    /**
     * add commas to whole numbers
     * @param value
     */
    transform(value: number): string {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

}
