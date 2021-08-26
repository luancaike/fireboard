import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';
import { WidgetConfig } from '../../widgets/widget.abstract';
import { FieldEditor } from '../../widgets/field-editor.dtos';
import { GetValueObjectByPath, SetValueObjectByPath } from '../../utils/objects';
import { debounce } from 'src/app/utils/effects';
import { ColorByDark } from '../../utils/chart';

@Component({
    selector: 'fb-style-editor',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './style-editor.component.html',
    styleUrls: ['./style-editor.component.scss']
})
export class StyleEditorComponent implements OnChanges {
    @Input() public fieldsEditor: FieldEditor[];
    @Output() public changedOptions = new EventEmitter<WidgetConfig>();
    @Input() legoOptions: WidgetConfig = null;

    public colorByDark = ColorByDark;
    public form = {};

    ngOnChanges(changes: SimpleChanges) {
        if (changes.legoOptions && this.legoOptions) {
            this.editLego();
        }
    }

    constructor(private cdr: ChangeDetectorRef) {}

    editLego(): void {
        this.form = {};
        this.setLegoOptionsValueInForm();
        this.cdr.detectChanges();
    }

    setLegoOptionsValueInForm(): void {
        const handler = (field) => {
            if (field.key) {
                this.form[field.key] = this.getValueByKeyPath(field.key);
            }
            if (Array.isArray(field.children)) {
                field.children.forEach(handler);
            }
        };
        this.fieldsEditor.forEach(handler);
    }

    checkDependenceKey(field: FieldEditor): boolean {
        if (!this.legoOptions) {
            return false;
        }
        if (typeof field.dependencyKey === 'string' && field.dependencyKey.length) {
            return !!this.getValueByKeyPath(field.dependencyKey);
        }
        return true;
    }

    @debounce(20)
    setValueByKeyPath(keyPath: string, value: unknown): void {
        this.setValueObjectByPath(keyPath, value);
    }

    trackBy(index: number, item: any): any {
        return item;
    }

    trackByKey(index: number, item: any): any {
        return item.key;
    }

    @debounce(1000)
    setValueColor(keyPath: string, value: unknown): void {
        this.setValueObjectByPath(keyPath, value);
    }

    addColor(keyPath: string, value: unknown[]): void {
        value.push('#fff');
        this.setValueObjectByPath(keyPath, value);
    }

    removeColor(keyPath: string, value: unknown[], itemRemove: unknown): void {
        const taskIndex = value.indexOf(itemRemove);
        if (taskIndex !== -1) {
            value.splice(taskIndex, 1);
        }
        this.setValueObjectByPath(keyPath, value);
    }

    setValueObjectByPath(keyPath: string, value: unknown): void {
        SetValueObjectByPath(this.legoOptions.options, keyPath, value);
        this.changedOptions.emit({ options: this.legoOptions.options });
        this.cdr.detectChanges();
    }

    getValueByKeyPath(keyPath: string): any {
        return GetValueObjectByPath(this.legoOptions.options, keyPath);
    }
}
