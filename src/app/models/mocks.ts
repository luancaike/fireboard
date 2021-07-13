import { DataSource, DataSourceKeyTypes } from './data-source.dtos';

export const DataSourceDataMockList: any[] = [
    {
        id: 1,
        data: [
            {
                id_risco: 1,
                qtd_associado: 41,
                nm_risco: 'Brown'
            },
            {
                id_risco: 2,
                qtd_associado: 16,
                nm_risco: 'McDonald'
            },
            {
                id_risco: 3,
                qtd_associado: 7,
                nm_risco: 'Curry'
            },
            {
                id_risco: 4,
                qtd_associado: 38,
                nm_risco: 'Floyd'
            },
            {
                id_risco: 5,
                qtd_associado: 17,
                nm_risco: 'Jiang'
            },
            {
                id_risco: 6,
                qtd_associado: 5,
                nm_risco: 'Barry'
            },
            {
                id_risco: 7,
                qtd_associado: 34,
                nm_risco: 'Pittman'
            },
            {
                id_risco: 8,
                qtd_associado: 10,
                nm_risco: 'Harrington'
            },
            {
                id_risco: 9,
                qtd_associado: 23,
                nm_risco: 'Glover'
            },
            {
                id_risco: 10,
                qtd_associado: 38,
                nm_risco: 'Chu'
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
        keys: [
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
            }
        ]
    },
    {
        name: 'Fatores de Riscos',
        id: 2,
        keys: [
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
