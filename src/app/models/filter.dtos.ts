import { DataSourceSelected } from './data-source.dtos';

export enum FilterQueryTypes {
    DateInterval = 1,
    EqualValue = 2,
    LikeValue = 3
}

export type FilterAction = (...any) => any[];

export interface FilterDto {
    key: string;
    dataSource?: DataSourceSelected;
    filterAction: FilterAction;
}

export interface FilterHandlerDto {
    sourceKey?: DataSourceSelected;
    filterKey?: string;
    type: FilterQueryTypes;
    filterValue?: any;
}

export interface FilterBindKey {
    filterKey: string;
    widgetKey: string;

    type: FilterQueryTypes;

    dataSource?: number | number[];
    keySource?: string;
}
