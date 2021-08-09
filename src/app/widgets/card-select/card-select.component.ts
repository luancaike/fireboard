import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    ViewEncapsulation
} from '@angular/core';
import { WidgetComponent } from '../widget.interface';
import { CardSelectDefault } from './card-select.default';
import { FireboardDataService } from '../../service/fireboard-data.service';
import { FilterAbstract } from '../filter.abstract';
import { debounce } from 'src/app/utils/effects';
import { FilterQueryTypes } from '../../models/filter.dtos';

@Component({
    selector: 'fb-card-select',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./card-select.component.scss'],
    template: `
        <fb-loading-widget [show]="isLoading"></fb-loading-widget>
        <div class="card-select">
            <input
                type="text"
                class="form-control input-search"
                placeholder="Pesquisar"
                [(ngModel)]="filterText"
                (ngModelChange)="filterTextAction()"
            />
            <fa-icon icon="search" class="icon"></fa-icon>
            <!--            <div class="select-all">-->
            <!--                <label class="container-checkbox">-->
            <!--                    Selecionar Todos-->
            <!--                    <input type="checkbox" [(ngModel)]="selectAll" />-->
            <!--                    <span class="checkmark"></span>-->
            <!--                </label>-->
            <!--            </div>-->
            <div class="column-list">
                <div class="column-item" *ngFor="let item of getItems">
                    <label class="container-checkbox">
                        {{ item.text }}
                        <input type="checkbox" [(ngModel)]="item.checked" (ngModelChange)="modelUpdate()" />
                        <span class="checkmark"></span>
                    </label>
                </div>
            </div>
        </div>
    `
})
export class CardSelectComponent extends FilterAbstract implements WidgetComponent, AfterViewInit {
    @Input() public legoData;
    public typeFilter = FilterQueryTypes.EqualValue;
    public selectAll = true;
    public filterText = '';
    public placeholder = 'placeholder';

    public get getItems() {
        return this.itemsFilter.length ? this.itemsFilter : this.items;
    }

    public itemsFilter = [];
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

    @debounce()
    filterTextAction() {
        this.itemsFilter = this.items.filter(
            (item) =>
                !this.filterText ||
                !this.filterText.length ||
                !!~item.text.toUpperCase().indexOf(this.filterText.toUpperCase())
        );
        this.cdr.detectChanges();
    }

    filterAction(data): any[] {
        const keySelected = this.getKeySelected();
        const selected = this.items.filter((item) => item.checked);
        return keySelected ? data.filter((el) => selected.find((sl) => el[keySelected.key] === sl.value)) : data;
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
            this.items = this.data.map((el) => ({ text: el[key], value: el[key], checked: true }));
            this.cdr.detectChanges();
        }
    }
}
