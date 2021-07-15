import { ChartOptions } from 'chart.js';
import { FieldEditor, FieldEditorTypes } from '../field-editor.dtos';
import { DataSourceBindOption } from '../widget.abstract';
import { DataSourceKeyTypes } from '../../models/data-source.dtos';

export class PieChartDefault {
    static options(): ChartOptions {
        return {
            plugins: {
                datalabels: {
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
                position: 'right',
                align: 'center'
            },
            layout: {
                padding: 30
            },
            maintainAspectRatio: false,
            responsive: true
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
                    },
                    {
                        key: 'title.position',
                        label: 'Posição',
                        type: FieldEditorTypes.Position,
                        data: [
                            {
                                value: 'bottom',
                                text: 'Inferior'
                            },
                            {
                                value: 'top',
                                text: 'Superior'
                            },
                            {
                                value: 'right',
                                text: 'Direita'
                            },
                            {
                                value: 'left',
                                text: 'Esquerda'
                            }
                        ],
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
                    },
                    {
                        key: 'legend.position',
                        label: 'Posição',
                        type: FieldEditorTypes.Position,
                        data: [
                            {
                                value: 'bottom',
                                text: 'Inferior'
                            },
                            {
                                value: 'top',
                                text: 'Superior'
                            },
                            {
                                value: 'right',
                                text: 'Direita'
                            },
                            {
                                value: 'left',
                                text: 'Esquerda'
                            }
                        ],
                        dependencyKey: 'legend.display'
                    },
                    {
                        key: 'legend.align',
                        label: 'Alinhamento',
                        type: FieldEditorTypes.Alignment,
                        data: [
                            {
                                value: 'start',
                                text: 'Inicio'
                            },
                            {
                                value: 'center',
                                text: 'Centro'
                            },
                            {
                                value: 'end',
                                text: 'Fim'
                            }
                        ],
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
                        type: FieldEditorTypes.Range,
                        max: 150
                    }
                ]
            },
            {
                type: FieldEditorTypes.EditorGroup,
                label: 'Rótulos de Dados',
                children: [
                    {
                        key: 'plugins.datalabels.display',
                        label: 'Mostrar',
                        type: FieldEditorTypes.Checkbox
                    },
                    {
                        key: 'plugins.datalabels.clamp',
                        label: 'Clamp',
                        type: FieldEditorTypes.Checkbox,
                        dependencyKey: 'plugins.datalabels.display'
                    },
                    {
                        key: 'plugins.datalabels.clip',
                        label: 'Clip',
                        type: FieldEditorTypes.Checkbox,
                        dependencyKey: 'plugins.datalabels.display'
                    },
                    {
                        key: 'plugins.datalabels.color',
                        label: 'Cor',
                        type: FieldEditorTypes.Color,
                        dependencyKey: 'plugins.datalabels.display'
                    },
                    {
                        key: 'plugins.datalabels.font.size',
                        label: 'Tamanho',
                        type: FieldEditorTypes.FontSize,
                        dependencyKey: 'plugins.datalabels.display'
                    },
                    {
                        key: 'plugins.datalabels.offset',
                        label: 'Deslocamento',
                        type: FieldEditorTypes.Number,
                        dependencyKey: 'plugins.datalabels.display'
                    },
                    {
                        key: 'plugins.datalabels.align',
                        label: 'Alinhamento',
                        type: FieldEditorTypes.Alignment,
                        data: [
                            {
                                value: 'center',
                                text: 'Centro'
                            },
                            {
                                value: 'start',
                                text: 'Inicio'
                            },
                            {
                                value: 'end',
                                text: 'Fim'
                            },
                            {
                                value: 'right',
                                text: 'Direita'
                            },
                            {
                                value: 'left',
                                text: 'Esquerda'
                            },
                            {
                                value: 'bottom',
                                text: 'Inferior'
                            },
                            {
                                value: 'top',
                                text: 'Superior'
                            }
                        ],
                        dependencyKey: 'plugins.datalabels.display'
                    },
                    {
                        key: 'plugins.datalabels.anchor',
                        label: 'Posição',
                        type: FieldEditorTypes.Position,
                        data: [
                            {
                                value: 'center',
                                text: 'Centro'
                            },
                            {
                                value: 'start',
                                text: 'Inicio'
                            },
                            {
                                value: 'end',
                                text: 'Fim'
                            }
                        ],
                        dependencyKey: 'plugins.datalabels.display'
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
