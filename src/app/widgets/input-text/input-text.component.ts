import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    ViewEncapsulation
} from '@angular/core';
import { WidgetComponent } from '../widget.interface';
import { InputTextDefault } from './input-text.default';
import { FireboardDataService } from '../../service/fireboard-data.service';
import { FilterAbstract } from '../filter.abstract';

@Component({
    selector: 'fb-input-text',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./input-text.component.scss'],
    template: `
        <fb-loading-widget [show]="isLoading"></fb-loading-widget>
        <input type="text" class="form-control input-text" [placeholder]="placeholder" />
    `
})
export class InputTextComponent extends FilterAbstract implements WidgetComponent, AfterViewInit {
    @Input() public legoData;
    public placeholder = 'Text';
    public filterKey = 'input-text';
    public dataSourceBindOptions = InputTextDefault.dataSourceBindOptions();
    public options = InputTextDefault.options();
    public fieldsEditor = InputTextDefault.fieldsEditor();

    constructor(protected cdr: ChangeDetectorRef, public fireboardDataService: FireboardDataService) {
        super(cdr);
    }

    filterAction(...any: any[]): any[] {
        throw new Error('Method not implemented.');
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
