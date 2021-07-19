import { FieldEditor } from '../field-editor.dtos';
import { DataSourceBindOption } from '../widget.abstract';
import { GridOptions } from 'ag-grid-community';

export class TableDefault {
    static options(): GridOptions {
        return {
            enableSorting: true,
            enableFilter: true,
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
            ]
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
