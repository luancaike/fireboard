import { DataSource, DataSourceKey, DataSourceKeyTypes } from '../../models/data-source.dtos';

export enum JoinType {
    Left = 1,
    Right = 2,
    Inner = 3
}

export enum FilterOperatorTypes {
    GreaterThan = 1,
    GreaterThanOrEqual = 2,
    LessThan = 3,
    LessThanOrEqual = 4,
    Between = 5,
    NotBetween = 6,
    Equal = 7,
    NotEqual = 8,
    In = 9,
    NotIn = 10,
    IsEmpty = 11,
    IsNotEmpty = 12,
    IsNull = 13,
    IsNotNull = 14,
    StartsWith = 15,
    EndsWith = 16,
    Contains = 17,
    NotContains = 18,
    Before = 19,
    After = 20
}

export interface FilterOperator {
    id: FilterOperatorTypes;
    text: string;
    amountValues: number;
}

export const FilterOperatorsNumber: FilterOperator[] = [
    {
        id: FilterOperatorTypes.GreaterThan,
        text: 'Maior do que',
        amountValues: 1
    },
    {
        id: FilterOperatorTypes.GreaterThanOrEqual,
        text: 'Maior que ou igual a',
        amountValues: 1
    },
    {
        id: FilterOperatorTypes.LessThan,
        text: 'Menor que',
        amountValues: 1
    },
    {
        id: FilterOperatorTypes.LessThanOrEqual,
        text: 'Menor que ou igual a',
        amountValues: 1
    },
    {
        id: FilterOperatorTypes.Between,
        text: 'Entre',
        amountValues: 2
    },
    {
        id: FilterOperatorTypes.NotBetween,
        text: 'Não está entre',
        amountValues: 2
    },
    {
        id: FilterOperatorTypes.Equal,
        text: 'É',
        amountValues: 1
    },
    {
        id: FilterOperatorTypes.NotEqual,
        text: 'Não é',
        amountValues: 1
    },
    {
        id: FilterOperatorTypes.IsEmpty,
        text: 'Vazio',
        amountValues: 0
    },
    {
        id: FilterOperatorTypes.IsNotEmpty,
        text: 'Não Vazio',
        amountValues: 0
    }
];
export const FilterOperatorsString: FilterOperator[] = [
    {
        id: FilterOperatorTypes.Equal,
        text: 'É',
        amountValues: 1
    },
    {
        id: FilterOperatorTypes.NotEqual,
        text: 'Não é',
        amountValues: 1
    },
    {
        id: FilterOperatorTypes.Contains,
        text: 'Contém',
        amountValues: 1
    },
    {
        id: FilterOperatorTypes.NotContains,
        text: 'Não Contém',
        amountValues: 1
    },
    {
        id: FilterOperatorTypes.StartsWith,
        text: 'Começa com',
        amountValues: 1
    },
    {
        id: FilterOperatorTypes.EndsWith,
        text: 'Termina em',
        amountValues: 1
    },
    {
        id: FilterOperatorTypes.IsEmpty,
        text: 'Vazio',
        amountValues: 0
    },
    {
        id: FilterOperatorTypes.IsNotEmpty,
        text: 'Não Vazio',
        amountValues: 0
    }
];
export const FilterOperatorsDate: FilterOperator[] = [
    {
        id: FilterOperatorTypes.Equal,
        text: 'É',
        amountValues: 1
    },
    {
        id: FilterOperatorTypes.NotEqual,
        text: 'Não é',
        amountValues: 1
    },
    {
        id: FilterOperatorTypes.Between,
        text: 'Entre',
        amountValues: 2
    },
    {
        id: FilterOperatorTypes.NotBetween,
        text: 'Não está entre',
        amountValues: 2
    },
    {
        id: FilterOperatorTypes.Before,
        text: 'Antes',
        amountValues: 1
    },
    {
        id: FilterOperatorTypes.After,
        text: 'Depois',
        amountValues: 1
    },
    {
        id: FilterOperatorTypes.IsEmpty,
        text: 'Vazio',
        amountValues: 0
    },
    {
        id: FilterOperatorTypes.IsNotEmpty,
        text: 'Não Vazio',
        amountValues: 0
    }
];

export interface JoinSqlBuild {
    columnPrimary: DataSourceKey;
    columnSecondary: DataSourceKey;
    joinType: JoinType;
    table: DataSource;
}

export interface FilterValuesSqlBuild {
    value: any;
    type: DataSourceKeyTypes;
}

export interface FilterSqlBuild {
    values: FilterValuesSqlBuild[];
    operator: FilterOperator;
    column: DataSourceKey;
}

export interface OrderSqlBuild extends DataSourceKey {
    direction: 'up' | 'down';
}

export interface ModelSqlBuild {
    table: DataSource;
    top: number;
    select: DataSourceKey[];
    group: DataSourceKey[];
    order: OrderSqlBuild[];
    filters: FilterSqlBuild[];
    forks: JoinSqlBuild[];
}

export const getDefaultModel = (): ModelSqlBuild => ({
    table: null,
    top: 0,
    select: [],
    group: [],
    order: [],
    filters: [],
    forks: []
});
export const getDefaultModelJoin = () => ({
    table: null,
    joinType: JoinType.Left,
    columnPrimary: null,
    columnSecondary: null
});
