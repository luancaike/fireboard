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
import { DataSourceKey } from '../../models/data-source.dtos';

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
        console.log(this.model);
        const keySelected = this.getKeySelected();
        return data.filter((el) => !this.model || el[keySelected.key] === this.model);
    }

    ngAfterViewInit() {
        if (this.legoData.data) {
            this.setConfig(this.legoData.data);
        } else {
            this.legoData.data = this.getOptions();
        }
    }

    modelUpdate(event): void {
        console.log(event);
        this.select.close();
        this.cdr.detectChanges();

        this.fireboardDataService.handlerFilter({ sourceKey: this.dataSource });
    }

    getKeySelected(): DataSourceKey {
        const sourceKey = this.dataSourceSelectedKeys.find(() => true);
        return sourceKey.data.find(() => true);
    }

    applyComponentData(): void {
        const keyData = this.getKeySelected();
        const key = keyData.key;
        this.placeholder = keyData.name;
        this.items = this.data.map((el) => ({ text: el[key], value: el[key] }));
        this.cdr.detectChanges();
    }

    ngOnDestroy(): void {
        this.fireboardDataService.removeFilterControl(this.legoData.key);
    }
}
