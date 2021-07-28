import { ChartOptions } from 'chart.js';
import { FieldEditor } from '../field-editor.dtos';
import { DataSourceBindOption } from '../widget.abstract';

export class CardSelectDefault {
    static options(): ChartOptions {
        return {};
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
                    max: 1,
                    required: true
                }
            }
        ];
    }
}
