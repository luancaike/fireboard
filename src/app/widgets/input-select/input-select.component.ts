import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { WidgetComponent } from '../widget.interface';
import { InputSelectDefault } from './input-select.default';
import { FireboardDataService } from '../../service/fireboard-data.service';
import { FilterAbstract } from '../filter.abstract';
import { NgSelectComponent } from '@ng-select/ng-select';
import { debounce } from '../../utils/effects';
import { WidgetOptions } from '../widget.abstract';
import { DateFilterDefault } from '../date-filter/date-filter.default';
import { FilterQueryTypes } from '../../models/filter.dtos';

@Component({
    selector: 'fb-input-select',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./input-select.component.scss'],
    template: `
        <fb-loading-widget [show]="isLoading"></fb-loading-widget>
        <div class="select-wrapper" #selectWrapper>
            <ng-select
                #select
                [(ngModel)]="model"
                (ngModelChange)="modelUpdate()"
                class="ng-select-auto"
                [appendTo]="'.canvas-container'"
                [placeholder]="placeholder"
                [bindLabel]="'text'"
                [bindValue]="'value'"
                [searchable]="true"
                [clearable]="true"
                [items]="items"
            ></ng-select>
        </div>
    `
})
export class InputSelectComponent extends FilterAbstract implements WidgetComponent, AfterViewInit {
    @ViewChild('selectWrapper') selectWrapper: ElementRef<HTMLDivElement>;
    @ViewChild('select') select: NgSelectComponent;
    @Input() public legoData;

    public typeFilter = FilterQueryTypes.EqualValue;
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

    ngAfterViewInit() {
        if (this.legoData.data) {
            this.setConfig(this.legoData.data);
        } else {
            this.legoData.data = this.getOptions();
        }
    }

    setOptions(options: WidgetOptions) {
        const defaultOptions = DateFilterDefault.options();
        const newOptions = { ...defaultOptions, ...options };
        super.setOptions(newOptions);
        this.applyStyleOptions();
    }

    applyStyleOptions() {
        const style = this.selectWrapper.nativeElement.style;
        style.setProperty('--dp-border-color', this.options.borderColor);
        style.setProperty('--dp-font-color', this.options.fontColor);
        style.setProperty('--dp-font-size', `${this.options.fontSize}px`);
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
    modelUpdate() {
        this.select.close();
        super.modelUpdate();
    }
}
