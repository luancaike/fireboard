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
import { ExternalDataService } from '../../service/external-data.service';
import { FilterAbstract } from '../filter.abstract';

@Component({
    selector: 'fb-input-text',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./input-text.component.scss'],
    template: `
        <fb-loading-widget [show]="isLoading"></fb-loading-widget>
        <input type="text" class="form-control input-text" placeholder="Text" />
    `
})
export class InputTextComponent extends FilterAbstract implements WidgetComponent, AfterViewInit {
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
    public dataSourceBindOptions = InputTextDefault.dataSourceBindOptions();
    public options = InputTextDefault.options();
    public fieldsEditor = InputTextDefault.fieldsEditor();

    constructor(protected cdr: ChangeDetectorRef, public externalDataService: ExternalDataService) {
        super(cdr);
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
