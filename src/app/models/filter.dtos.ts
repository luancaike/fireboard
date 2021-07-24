export type FilterAction = (...any) => any[];

export interface FilterDto {
    key: string;
    dataSource?: number;
    filterAction: FilterAction;
}