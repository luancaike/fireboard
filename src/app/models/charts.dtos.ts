export type ChartTypes = 'bar-chart' | 'line-chart' | 'pie-chart' | 'table' | '';

export interface ChartItemConfig {
    id: number;
    name: string;
    data: any;
    type: ChartTypes;
}
