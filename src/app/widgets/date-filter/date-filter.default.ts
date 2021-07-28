import { FieldEditor, FieldEditorTypes } from '../field-editor.dtos';
import { DataSourceBindOption } from '../widget.abstract';
import { DataSourceKeyTypes } from '../../models/data-source.dtos';

export class DateFilterDefault {
    static options(): { [key: string]: any } {
        return {
            borderColor: '#ccc',
            fontColor: '#777777',
            fontSize: 16
        };
    }

    static fieldsEditor(): FieldEditor[] {
        return [
            {
                key: 'borderColor',
                label: 'Cor da Borda',
                type: FieldEditorTypes.Color
            },
            {
                key: 'fontColor',
                label: 'Cor da Fonte',
                type: FieldEditorTypes.Color
            },
            {
                key: 'fontSize',
                label: 'Tamanho da Fonte',
                type: FieldEditorTypes.FontSize
            }
        ];
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
