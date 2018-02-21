import { GetCarAPI } from "./cars.model";

export interface FilteredDataAndPagination {
    usePagination: boolean;
    cars: GetCarAPI[];
    total: number;   
    page: number;
    displayRange: string;
    isNext: boolean;
    isPrev: boolean;
    nextLink: any[];
    nextParams: object;
    prevLink: any[];
    prevParams: object;
}