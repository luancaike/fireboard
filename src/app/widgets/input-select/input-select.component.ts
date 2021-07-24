import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    ViewEncapsulation
} from '@angular/core';
import { WidgetComponent } from '../widget.interface';
import { InputSelectDefault } from './input-select.default';
import { FireboardDataService } from '../../service/fireboard-data.service';
import { FilterAbstract } from '../filter.abstract';

@Component({
    selector: 'fb-input-select',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./input-select.component.scss'],
    template: `
        <fb-loading-widget [show]="isLoading"></fb-loading-widget>
        <ng-select
            class="ng-select-auto"
            [appendTo]="'.canvas-container'"
            [placeholder]="placeholder"
            [hideSelected]="true"
            [closeOnSelect]="true"
            [bindLabel]="'text'"
            [bindValue]="'value'"
            [searchable]="true"
            [clearable]="true"
            [items]="items"
        ></ng-select>
    `
})
export class InputSelectComponent extends FilterAbstract implements WidgetComponent, AfterViewInit {
    @Input() public legoData;
    public placeholder = 'placeholder';
    public items = [
        {
            text: 'Teste 1',
            value: 1
        },
        {
            text: 'Teste 2',
            value: 2
        },
        {
            text: 'Teste 3',
            value: 3
        }
    ];
    public dataSourceBindOptions = InputSelectDefault.dataSourceBindOptions();
    public options = InputSelectDefault.options();
    public fieldsEditor = InputSelectDefault.fieldsEditor();
    public filterKey = 'input-select';

    constructor(protected cdr: ChangeDetectorRef, public fireboardDataService: FireboardDataService) {
        super(cdr);
    }

    filterAction(...any): any[] {
        return [];
    }

    ngAfterViewInit() {
        if (this.legoData.data) {
            this.setConfig(this.legoData.data);
        } else {
            this.legoData.data = this.getOptions();
        }
    }

    applyComponentData(): void {
        //
    }
}
