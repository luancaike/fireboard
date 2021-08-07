import { DataSourceSelected } from './data-source.dtos';

export type FilterAction = (...any) => any[];

export interface FilterDto {
    key: string;
    dataSource?: DataSourceSelected;
    filterAction: FilterAction;
}

export interface FilterHandlerDto {
    sourceKey?: DataSourceSelected;
}
