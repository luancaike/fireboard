export type FieldEditor =
    | FieldEditorBase
    | FieldEditorSelect
    | FieldEditorColor
    | FieldEditorCheckbox
    | FieldEditorGroup
    | FieldEditorAlignment
    | FieldEditorPosition
    | FieldEditorRange;

export enum FieldEditorTypes {
    Text = 'text',
    Number = 'number',
    Select = 'select',
    Color = 'color',
    Checkbox = 'checkbox',
    EditorGroup = 'editorgroup',
    FontSize = 'fontsize',
    Alignment = 'alignment',
    Position = 'position',
    Range = 'range'
}

export interface FieldEditorBase {
    key?: string;
    type: FieldEditorTypes;
    label: string;
    dependencyKey?: string;
}

export interface FieldEditorDirections {
    label?: string;
    icon: string;
    value: any;
}

export interface FieldEditorSelect extends FieldEditorBase {
    type: FieldEditorTypes.Select;
    data: { text: string; value: any }[];
}
export interface FieldEditorAlignment extends FieldEditorBase {
    type: FieldEditorTypes.Alignment;
    data: { text: string; value: any }[];
}
export interface FieldEditorPosition extends FieldEditorBase {
    type: FieldEditorTypes.Position;
    data: { text: string; value: any }[];
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

export interface FieldEditorRange extends FieldEditorBase {
    type: FieldEditorTypes.Range;
    step?: number;
    max?: number;
    min?: number;
}
