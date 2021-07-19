export interface SourceItemFilter {
    key: string;
    action: (any) => any;
}

export enum ReturnItemTypes {
    TEXT = 'text',
    NUMBER = 'number',
    OPERATOR = 'operator',
    COLUMN = 'column'
}

export enum TypeExpression {
    CONDITION = 1,
    GROUP = 2
}

export enum ColumnOperators {
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
    Contains = 17
}

export const ReturnTypes = [
    { type: ReturnItemTypes.TEXT, value: 'Texto', label: 'Texto' },
    { type: ReturnItemTypes.NUMBER, value: 0, label: 'Número' },
    { type: ReturnItemTypes.OPERATOR, value: '+', label: 'Operador' },
    { type: ReturnItemTypes.COLUMN, value: null, label: 'Coluna' }
];
export const OperatorsText = [
    { label: 'startsWith', value: ColumnOperators.StartsWith },
    { label: 'endsWith', value: ColumnOperators.EndsWith },
    { label: 'contains', value: ColumnOperators.Contains },
    { label: 'equal', value: ColumnOperators.Equal },
    { label: 'notEqual', value: ColumnOperators.NotEqual },
    { label: 'in', value: ColumnOperators.In },
    { label: 'notIn', value: ColumnOperators.NotIn },
    { label: 'isEmpty', value: ColumnOperators.IsEmpty },
    { label: 'isNotEmpty', value: ColumnOperators.IsNotEmpty },
    { label: 'isNull', value: ColumnOperators.IsNull },
    { label: 'isNotNull', value: ColumnOperators.IsNotNull }
];
export const OperatorsNumber = [
    { label: 'greaterThan', value: ColumnOperators.GreaterThan },
    { label: 'greaterThanOrEqual', value: ColumnOperators.GreaterThanOrEqual },
    { label: 'lessThan', value: ColumnOperators.LessThan },
    { label: 'lessThanOrEqual', value: ColumnOperators.LessThanOrEqual },
    { label: 'between', value: ColumnOperators.Between },
    { label: 'notBetween', value: ColumnOperators.NotBetween },
    { label: 'equal', value: ColumnOperators.Equal },
    { label: 'notEqual', value: ColumnOperators.NotEqual },
    { label: 'in', value: ColumnOperators.In },
    { label: 'notIn', value: ColumnOperators.NotIn },
    { label: 'isEmpty', value: ColumnOperators.IsEmpty },
    { label: 'isNotEmpty', value: ColumnOperators.IsNotEmpty },
    { label: 'isNull', value: ColumnOperators.IsNull },
    { label: 'isNotNull', value: ColumnOperators.IsNotNull }
];

export interface ReturnData {
    type: ReturnItemTypes;
    value: any;
    label: string;
}

export interface SelectedColumn {
    key: string;
    type: string;
}

export interface SelectedOperator {
    label: string;
    value: number;
}

export interface Expression {
    selectedColumn?: SelectedColumn;
    selectedOperator?: SelectedOperator;
    selectedParameters?: any | any[];
    elseExpression?: ReturnData[];
    elseIfExpression?: Expression[];
    returnData?: ReturnData[];
    logicalOperators?: 'AND' | 'OR';
    type: number;
    rules?: Expression[];
}

export interface CustomFilterDto {
    expression: Expression;
    label: string;
}

export const DefaultFilterConfig = (): CustomFilterDto => ({
    label: null,
    expression: {
        elseExpression: null,
        elseIfExpression: [],
        returnData: [],
        type: TypeExpression.GROUP,
        logicalOperators: 'AND',
        rules: [
            {
                selectedColumn: null,
                selectedOperator: null,
                selectedParameters: null,
                type: TypeExpression.CONDITION
            }
        ]
    }
});
