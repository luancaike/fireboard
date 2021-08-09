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
import { InputTextDefault } from './input-text.default';
import { FireboardDataService } from '../../service/fireboard-data.service';
import { FilterAbstract } from '../filter.abstract';
import { debounce } from '../../utils/effects';
import { WidgetOptions } from '../widget.abstract';
import { DateFilterDefault } from '../date-filter/date-filter.default';
import { FilterQueryTypes } from '../../models/filter.dtos';

@Component({
    selector: 'fb-input-text',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./input-text.component.scss'],
    template: `
        <fb-loading-widget [show]="isLoading"></fb-loading-widget>
        <input
            #input
            type="text"
            class="form-control input-text"
            [(ngModel)]="model"
            (ngModelChange)="modelUpdate()"
            [placeholder]="placeholder"
        />
    `
})
export class InputTextComponent extends FilterAbstract implements WidgetComponent, AfterViewInit {
    @ViewChild('input') input: ElementRef<HTMLInputElement>;
    @Input() public legoData;

    public typeFilter = FilterQueryTypes.LikeValue;
    public model = null;
    public placeholder = 'Texto';
    public filterKey = 'input-text';
    public dataSourceBindOptions = InputTextDefault.dataSourceBindOptions();
    public options = InputTextDefault.options();
    public fieldsEditor = InputTextDefault.fieldsEditor();

    constructor(protected cdr: ChangeDetectorRef, public fireboardDataService: FireboardDataService) {
        super(cdr);
    }

    ngAfterViewInit() {
        this.modelFilterUpdate(this.model);
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
        const style = this.input.nativeElement.style;
        style.setProperty('--dp-border-color', this.options.borderColor);
        style.setProperty('--dp-font-color', this.options.fontColor);
        style.setProperty('--dp-font-size', `${this.options.fontSize}px`);
    }

    applyComponentData(): void {
        const keyData = this.getKeySelected();
        if (keyData) {
            this.placeholder = keyData.name;
            this.cdr.detectChanges();
        }
    }

    @debounce()
    modelUpdate() {
        this.modelFilterUpdate(this.model);
        super.modelUpdate();
    }
}
