import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { WidgetComponent } from '../widget.interface';
import { InputSelectDefault } from './input-select.default';
import { FireboardDataService } from '../../service/fireboard-data.service';
import { FilterAbstract } from '../filter.abstract';
import { NgSelectComponent } from '@ng-select/ng-select';
import { debounce } from '../../utils/effects';

@Component({
    selector: 'fb-input-select',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./input-select.component.scss'],
    template: `
        <fb-loading-widget [show]="isLoading"></fb-loading-widget>
        <ng-select
            #select
            [(ngModel)]="model"
            (ngModelChange)="modelUpdate($event)"
            class="ng-select-auto"
            [appendTo]="'.canvas-container'"
            [placeholder]="placeholder"
            [bindLabel]="'text'"
            [bindValue]="'value'"
            [searchable]="true"
            [clearable]="true"
            [items]="items"
        ></ng-select>
    `
})
export class InputSelectComponent extends FilterAbstract implements WidgetComponent, AfterViewInit, OnDestroy {
    @ViewChild('select') select: NgSelectComponent;
    @Input() public legoData;
    public model = null;
    public placeholder = 'Selecione...';
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

    filterAction(data): any[] {
        const keySelected = this.getKeySelected();
        return keySelected ? data.filter((el) => !this.model || el[keySelected.key] === this.model) : data;
    }

    ngAfterViewInit() {
        if (this.legoData.data) {
            this.setConfig(this.legoData.data);
        } else {
            this.legoData.data = this.getOptions();
        }
    }

    applyComponentData(): void {
        const keyData = this.getKeySelected();
        if (keyData) {
            const key = keyData.key;
            this.placeholder = keyData.name;
            this.items = this.data.map((el) => ({ text: el[key], value: el[key] }));
            this.cdr.detectChanges();
        }
    }

    @debounce()
    modelUpdate(event: any) {
        this.select.close();
        super.modelUpdate(event);
    }

    ngOnDestroy(): void {
        this.fireboardDataService.removeFilterControl(this.legoData.key);
    }
}
