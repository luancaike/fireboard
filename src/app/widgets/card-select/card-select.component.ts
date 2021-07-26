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
import { CardSelectDefault } from './card-select.default';
import { FireboardDataService } from '../../service/fireboard-data.service';
import { FilterAbstract } from '../filter.abstract';

@Component({
    selector: 'fb-card-select',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./card-select.component.scss'],
    template: `
        <fb-loading-widget [show]="isLoading"></fb-loading-widget>
        <div class="card-select">
            <input type="text" class="form-control input-search" placeholder="Pesquisar" />
            <fa-icon icon="search" class="icon"></fa-icon>
            <div class="column-list">
                <div class="column-item" *ngFor="let item of items">
                    <label class="container-checkbox">
                        {{ item.text }}
                        <input type="checkbox" [(ngModel)]="item.checked" />
                        <span class="checkmark"></span>
                    </label>
                </div>
            </div>
        </div>
    `
})
export class CardSelectComponent extends FilterAbstract implements WidgetComponent, AfterViewInit, OnDestroy {
    @Input() public legoData;
    public placeholder = 'placeholder';
    public items = [
        {
            text: 'Teste 1',
            value: 1,
            checked: true
        },
        {
            text: 'Teste 2',
            value: 2,
            checked: true
        },
        {
            text: 'Teste 3',
            value: 3,
            checked: true
        }
    ];
    public filterKey = 'card-select';
    public dataSourceBindOptions = CardSelectDefault.dataSourceBindOptions();
    public options = CardSelectDefault.options();
    public fieldsEditor = CardSelectDefault.fieldsEditor();

    constructor(protected cdr: ChangeDetectorRef, public fireboardDataService: FireboardDataService) {
        super(cdr);
    }

    filterAction(any: any[]): any[] {
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

    ngOnDestroy(): void {
        this.fireboardDataService.removeFilterControl(this.legoData.key);
    }
}
