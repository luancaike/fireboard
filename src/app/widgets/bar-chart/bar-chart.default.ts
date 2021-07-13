import { ChartOptions } from 'chart.js';
import { FieldEditor, FieldEditorTypes } from '../field-editor.dtos';
import { DataSourceBindOption } from '../widget.abstract';
import { DataSourceKeyTypes } from '../../models/data-source.dtos';

export class BarChartDefault {
    static options(): ChartOptions {
        return {
            plugins: {
                datalabels: {
                    offset: -5,
                    color: '#66686b',
                    clamp: true,
                    display: 'auto',
                    anchor: 'end',
                    align: 'end',
                    clip: false,
                    font: {
                        size: 14
                    }
                }
            },
            layout: {
                padding: 30
            },
            title: {
                fontColor: '#66686b',
                fontSize: 12,
                display: false,
                text: 'Titulo',
                position: 'top'
            },
            legend: {
                fullWidth: true,
                display: true,
                position: 'bottom',
                align: 'center'
            },
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                yAxes: [
                    {
                        gridLines: {
                            display: true,
                            lineWidth: 1,
                            color: '#ddd'
                        },
                        ticks: {
                            display: true,
                            fontSize: 12,
                            fontColor: '#66686b',
                            maxTicksLimit: 5,
                            beginAtZero: true
                        }
                    }
                ],
                xAxes: [
                    {
                        ticks: {
                            display: true,
                            fontSize: 12,
                            fontColor: '#66686b'
                        },
                        gridLines: {
                            display: false,
                            lineWidth: 1,
                            color: '#ddd'
                        }
                    }
                ]
            }
        };
    }

    static fieldsEditor(): FieldEditor[] {
        return [
            {
                type: FieldEditorTypes.EditorGroup,
                label: 'Título',
                children: [
                    {
                        key: 'title.display',
                        label: 'Mostrar',
                        type: FieldEditorTypes.Checkbox
                    },
                    {
                        key: 'title.text',
                        label: 'Texto',
                        type: FieldEditorTypes.Text,
                        dependencyKey: 'title.display'
                    },
                    {
                        key: 'title.fontSize',
                        label: 'Tamanho da Fonte',
                        type: FieldEditorTypes.FontSize,
                        dependencyKey: 'title.display'
                    },
                    {
                        key: 'title.fontColor',
                        label: 'Cor da Fonte',
                        type: FieldEditorTypes.Color,
                        dependencyKey: 'title.display'
                    }
                ]
            },
            {
                type: FieldEditorTypes.EditorGroup,
                label: 'Legenda',
                children: [
                    {
                        key: 'legend.display',
                        label: 'Mostrar',
                        type: FieldEditorTypes.Checkbox
                    },
                    {
                        key: 'legend.fullWidth',
                        label: 'Largura Completa',
                        type: FieldEditorTypes.Checkbox,
                        dependencyKey: 'legend.display'
                    }
                ]
            },
            {
                type: FieldEditorTypes.EditorGroup,
                label: 'Layout',
                children: [
                    {
                        key: 'layout.padding',
                        label: 'Preenchimento',
                        type: FieldEditorTypes.Number
                    }
                ]
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
                    allowTypes: [DataSourceKeyTypes.Custom, DataSourceKeyTypes.Number]
                }
            },
            {
                label: 'Rótulos',
                key: 'labels',
                rules: {
                    required: true
                }
            }
        ];
    }
}
