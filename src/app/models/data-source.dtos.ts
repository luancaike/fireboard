export type DataSourceSelected = number | number[];

export enum DataSourceKeyTypes {
    Boolean = 'boolean',
    String = 'string',
    Date = 'date',
    Number = 'number',
    Custom = 'custom'
}

export interface DataSource {
    id: number;
    name: string;
    columns: DataSourceKey[];
}

export interface DataSourceKey {
    id: number;
    type: DataSourceKeyTypes;
    name: string;
    key: string;
}
export interface FilterModel {
    id: number;
    name: string;
}
