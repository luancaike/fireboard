import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'fb-select-column',
    styleUrls: ['./select-column.component.scss'],
    template: `
        <div class="input-group w-100">
            <ng-select
                class="ng-select-sm ng-select-column"
                [placeholder]="placeholder"
                [hideSelected]="true"
                [appendTo]="appendTo"
                [closeOnSelect]="!multiple"
                (ngModelChange)="valueChange($event)"
                [ngModel]="value"
                [bindLabel]="bindLabel"
                [bindValue]="bindValue"
                [searchable]="searchable"
                [clearable]="clearable"
                [multiple]="multiple"
                [items]="items"
                style="flex-grow: 1; width: 214px;"
            >
                <ng-template ng-label-tmp let-item="item" let-clear="clear">
                    <div
                        style="padding: 0 10px"
                        [class.custom]="item.type === 'custom'"
                        [class.number]="item.type === 'number'"
                        [class.string]="item.type === 'string'"
                        [class.date]="item.type === 'date'"
                    >
                        <span class="ng-value-label">
                            <fa-icon *ngIf="item.type === 'custom'" icon="code" class="mr-2"></fa-icon>
                            <fa-icon *ngIf="item.type === 'number'" icon="calculator" class="mr-2"></fa-icon>
                            <fa-icon *ngIf="item.type === 'string'" icon="font" class="mr-2"></fa-icon>
                            <fa-icon *ngIf="item.type === 'date'" icon="calendar" class="mr-2"></fa-icon>
                            {{ item.name }}
                        </span>
                        <span class="ng-value-icon right" (click)="clear(item)" aria-hidden="true">×</span>
                    </div>
                </ng-template>
                <ng-template ng-option-tmp let-item="item" let-index="index" let-search="searchTerm">
                    <div
                        class="ng-option-label"
                        [class.custom]="item.type === 'custom'"
                        [class.number]="item.type === 'number'"
                        [class.string]="item.type === 'string'"
                        [class.date]="item.type === 'date'"
                    >
                        <fa-icon *ngIf="item.type === 'custom'" icon="code" class="mr-2"></fa-icon>
                        <fa-icon *ngIf="item.type === 'number'" icon="calculator" class="mr-2"></fa-icon>
                        <fa-icon *ngIf="item.type === 'string'" icon="font" class="mr-2"></fa-icon>
                        <fa-icon *ngIf="item.type === 'date'" icon="calendar" class="mr-2"></fa-icon>
                        {{ item.name }}
                    </div>
                </ng-template>
            </ng-select>
            <div class="input-group-append" style="height: 30px;">
                <ng-content></ng-content>
            </div>
        </div>
    `
})
export class SelectColumnComponent {
    @Input() items: any[];
    @Input() appendTo = null;
    @Input() clearable: boolean;
    @Input() searchable: boolean;
    @Input() multiple: boolean;
    @Input() placeholder: string;
    @Input() bindLabel: string;
    @Input() bindValue: string;
    @Input() value;

    @Input() valueChange: (data: any) => any;
}
