import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    ViewEncapsulation
} from '@angular/core';
import { WidgetComponent } from '../widget.interface';
import { InputTextDefault } from './input-text.default';
import { FireboardDataService } from '../../service/fireboard-data.service';
import { FilterAbstract } from '../filter.abstract';
import { debounce } from '../../utils/effects';

@Component({
    selector: 'fb-input-text',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./input-text.component.scss'],
    template: `
        <fb-loading-widget [show]="isLoading"></fb-loading-widget>
        <input
            type="text"
            class="form-control input-text"
            [(ngModel)]="model"
            (ngModelChange)="modelUpdate($event)"
            [placeholder]="placeholder"
        />
    `
})
export class InputTextComponent extends FilterAbstract implements WidgetComponent, AfterViewInit, OnDestroy {
    @Input() public legoData;
    public model = null;
    public placeholder = 'Texto';
    public filterKey = 'input-text';
    public dataSourceBindOptions = InputTextDefault.dataSourceBindOptions();
    public options = InputTextDefault.options();
    public fieldsEditor = InputTextDefault.fieldsEditor();

    constructor(protected cdr: ChangeDetectorRef, public fireboardDataService: FireboardDataService) {
        super(cdr);
    }

    filterAction(data): any[] {
        console.log(this.model);
        const keySelected = this.getKeySelected();
        return data.filter(
            (el) =>
                !this.model ||
                (typeof this.model === 'string' &&
                    this.model.length &&
                    !!~el[keySelected.key].toUpperCase().indexOf(this.model.toUpperCase()))
        );
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
        this.placeholder = keyData.name;
        this.cdr.detectChanges();
    }

    @debounce()
    modelUpdate(event: any) {
        super.modelUpdate(event);
    }

    ngOnDestroy(): void {
        this.fireboardDataService.removeFilterControl(this.legoData.key);
    }
}
