import { DataSource, DataSourceKeyTypes } from './data-source.dtos';
import { ChartItemConfig } from './charts.dtos';

export const DataSourceDataMockList: any[] = [
    {
        id: 1,
        data: [
            {
                id_risco: 1,
                qtd_associado: 41,
                nm_risco: 'Brown',
                dt_create: '2021-07-20T18:04:17.033Z'
            },
            {
                id_risco: 2,
                qtd_associado: 16,
                nm_risco: 'McDonald',
                dt_create: '2021-07-21T18:04:17.033Z'
            },
            {
                id_risco: 3,
                qtd_associado: 7,
                nm_risco: 'Curry',
                dt_create: '2021-07-22T18:04:17.033Z'
            },
            {
                id_risco: 4,
                qtd_associado: 38,
                nm_risco: 'Floyd',
                dt_create: '2021-07-23T18:04:17.033Z'
            },
            {
                id_risco: 5,
                qtd_associado: 17,
                nm_risco: 'Jiang',
                dt_create: '2021-07-24T18:04:17.033Z'
            },
            {
                id_risco: 6,
                qtd_associado: 5,
                nm_risco: 'Barry',
                dt_create: '2021-07-25T18:04:17.033Z'
            },
            {
                id_risco: 7,
                qtd_associado: 34,
                nm_risco: 'Pittman',
                dt_create: '2021-07-26T18:04:17.033Z'
            },
            {
                id_risco: 8,
                qtd_associado: 10,
                nm_risco: 'Harrington',
                dt_create: '2021-07-27T18:04:17.033Z'
            },
            {
                id_risco: 9,
                qtd_associado: 23,
                nm_risco: 'Glover',
                dt_create: '2021-07-28T18:04:17.033Z'
            },
            {
                id_risco: 10,
                qtd_associado: 38,
                nm_risco: 'Chu',
                dt_create: '2021-07-29T18:04:17.033Z'
            }
        ]
    },
    {
        id: 2,
        data: [
            {
                id_fator_risco: 1,
                qtd_associado: 22,
                nm_fator_risco: 'Eason'
            },
            {
                id_fator_risco: 2,
                qtd_associado: 31,
                nm_fator_risco: 'Skinner'
            },
            {
                id_fator_risco: 3,
                qtd_associado: 45,
                nm_fator_risco: 'O'
            },
            {
                id_fator_risco: 4,
                qtd_associado: 48,
                nm_fator_risco: 'Case'
            },
            {
                id_fator_risco: 5,
                qtd_associado: 7,
                nm_fator_risco: 'Daniels'
            },
            {
                id_fator_risco: 6,
                qtd_associado: 36,
                nm_fator_risco: 'Casey'
            },
            {
                id_fator_risco: 7,
                qtd_associado: 37,
                nm_fator_risco: 'Bunn'
            },
            {
                id_fator_risco: 8,
                qtd_associado: 27,
                nm_fator_risco: 'King'
            },
            {
                id_fator_risco: 9,
                qtd_associado: 42,
                nm_fator_risco: 'Sherrill'
            },
            {
                id_fator_risco: 10,
                qtd_associado: 28,
                nm_fator_risco: 'Field'
            }
        ]
    }
];
export const DataSourceMockList: DataSource[] = [
    {
        name: 'Riscos Associados',
        id: 1,
        columns: [
            {
                id: 1,
                key: 'id_risco',
                name: 'N° Risco',
                type: DataSourceKeyTypes.Number
            },
            {
                id: 2,
                key: 'nm_risco',
                name: 'Nome Risco',
                type: DataSourceKeyTypes.String
            },
            {
                id: 3,
                key: 'qtd_associado',
                name: 'Quantidade',
                type: DataSourceKeyTypes.Number
            },
            {
                id: 4,
                key: 'dt_create',
                name: 'Data de Criação',
                type: DataSourceKeyTypes.Date
            }
        ]
    },
    {
        name: 'Fatores de Riscos',
        id: 2,
        columns: [
            {
                id: 1,
                key: 'id_fator_risco',
                name: 'N° Fator de Risco',
                type: DataSourceKeyTypes.Number
            },
            {
                id: 2,
                key: 'nm_fator_risco',
                name: 'Nome Fator de Risco',
                type: DataSourceKeyTypes.String
            },
            {
                id: 3,
                key: 'qtd_associado',
                name: 'Quantidade',
                type: DataSourceKeyTypes.Number
            }
        ]
    }
];
export const ChartsMockList: ChartItemConfig[] = [
    {
        id: 1,
        data: {
            dataSourceSelectedKeys: [
                {
                    key: 'datasets',
                    data: [
                        {
                            id: 3,
                            key: 'qtd_associado',
                            name: 'Quantidade',
                            type: 'number'
                        }
                    ]
                },
                {
                    key: 'labels',
                    data: [
                        {
                            id: 2,
                            key: 'nm_risco',
                            name: 'Nome Risco',
                            type: 'string'
                        }
                    ]
                }
            ],
            dataSourceBindOptions: [
                {
                    label: 'Dados',
                    key: 'datasets',
                    rules: {
                        required: true,
                        allowTypes: ['custom', 'number']
                    }
                },
                {
                    label: 'Rótulos',
                    key: 'labels',
                    rules: {
                        required: true
                    }
                }
            ],
            filters: [],
            dataSource: 1,
            options: {
                plugins: {
                    colorschemes: {
                        override: true,
                        scheme: ['#7243f4', '#F44242', '#42F480']
                    },
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
                animation: {
                    duration: 0
                },
                hover: {
                    animationDuration: 0
                },
                responsiveAnimationDuration: 0,
                layout: {
                    padding: 31
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
            }
        },
        type: 'bar-chart',
        name: 'Total de Riscos por Barra'
    },
    {
        id: 2,
        data: {},
        type: 'line-chart',
        name: 'Total de Riscos por Linha'
    },
    {
        id: 3,
        data: {},
        type: 'table',
        name: 'Tabela de Riscos'
    }
];
