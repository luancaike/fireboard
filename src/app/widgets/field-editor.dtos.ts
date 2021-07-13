export type FieldEditor =
    | FieldEditorBase
    | FieldEditorSelect
    | FieldEditorColor
    | FieldEditorCheckbox
    | FieldEditorGroup;

export enum FieldEditorTypes {
    Text = 'text',
    Number = 'number',
    Select = 'select',
    Color = 'color',
    Checkbox = 'checkbox',
    EditorGroup = 'editorgroup',
    FontSize = 'fontsize'
}

export interface FieldEditorBase {
    key?: string;
    type: FieldEditorTypes;
    label: string;
    dependencyKey?: string;
}

export interface FieldEditorSelect extends FieldEditorBase {
    type: FieldEditorTypes.Select;
    data: { key: never; value: any }[];
}

export interface FieldEditorColor extends FieldEditorBase {
    type: FieldEditorTypes.Color;
    options?: { key: never; value: any }[];
}

export interface FieldEditorCheckbox extends FieldEditorBase {
    type: FieldEditorTypes.Checkbox;
    options?: { key: never; value: any }[];
}
export interface FieldEditorGroup extends FieldEditorBase {
    type: FieldEditorTypes.EditorGroup;
    children: FieldEditor[];
}
