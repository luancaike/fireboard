import { ChartOptions } from 'chart.js';
import { FieldEditor } from '../field-editor.dtos';
import { DataSourceBindOption } from '../widget.abstract';
import { DataSourceKeyTypes } from '../../models/data-source.dtos';

export class DateFilterDefault {
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
                    required: true,
                    max: 1,
                    allowTypes: [DataSourceKeyTypes.Date]
                }
            }
        ];
    }
}
