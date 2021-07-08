export type FieldEditor = FieldEditorBase | FieldEditorSelect | FieldEditorColor;

export interface FieldEditorBase {
    key: string;
    type: 'text' | 'number' | 'select' | 'color' | 'checkbox';
    label: string;
    dependencyKey?: string;
}

export interface FieldEditorSelect extends FieldEditorBase {
    type: 'select';
    data: { key: never; value: any }[];
}

export interface FieldEditorColor extends FieldEditorBase {
    type: 'color';
    options?: { key: never; value: any }[];
}
