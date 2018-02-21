import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'capitalcase'
})
export class CapitalcasePipe implements PipeTransform {

    /**
     * capitalize each word
     * @param value
     */
    transform(value: string): string {
        return value.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    }

}
