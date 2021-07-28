import { FieldEditor } from '../field-editor.dtos';
import { DataSourceBindOption } from '../widget.abstract';
import { GridOptions, ColumnResizedEvent } from 'ag-grid-community';

export class TableDefault {
    static options(): GridOptions {
        return {
            columnDefs: [
                {
                    headerName: 'ID',
                    field: 'id',
                    width: 100
                },
                {
                    headerName: 'Value',
                    field: 'value',
                    width: 100
                }
            ],
            rowData: [
                { id: 5, value: 10 },
                { id: 10, value: 15 },
                { id: 15, value: 20 }
            ],
            statusBar: {
                statusPanels: [
                    {
                        statusPanel: 'statusBarComponent',
                        align: 'left'
                    }
                ]
            },
            sideBar: {
                toolPanels: ['columns', 'filters'],
                defaultToolPanel: ''
            },
            animateRows: true,
            enableColResize: true,
            enableSorting: true,
            enableFilter: true,
            rowHeight: 30,
            enableRangeSelection: true,
            // localeTextFunc(key: string, defaultValue: any) {
            //     const gridKey = 'grid.' + key;
            //     const value = self.filter.translate(gridKey);
            //     return value === gridKey ? defaultValue : value;
            // },
            // getRowNodeId: (data: any) => data[chavePrimary],
            columnTypes: {
                dimension: {
                    enableRowGroup: true,
                    enablePivot: true
                },
                actions: {
                    width: 90,
                    suppressResize: true,
                    cellClass: 'text-center'
                }
            },
            onColumnResized: (grid: ColumnResizedEvent) => {
                grid.api.resetRowHeights();
            },
            onGridReady: (grid: any) => {
                grid.api.resetRowHeights();
            },
            onCellValueChanged: (grid: any) => {
                grid.api.resetRowHeights();
            },
            onRowDataChanged: (grid: any) => {
                setTimeout(() => {
                    grid.api.resetRowHeights();
                }, 100);
            }
        };
    }

    static fieldsEditor(): FieldEditor[] {
        return [];
    }

    static dataSourceBindOptions(): DataSourceBindOption[] {
        return [
            {
                label: 'Dados',
                key: 'datasets',
                rules: {
                    required: true
                }
            }
        ];
    }
}
