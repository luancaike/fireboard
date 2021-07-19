import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataSourceKey, FilterModel } from '../../models/data-source.dtos';

@Component({
    selector: 'fb-filter-selector',
    template: `
        <div
            class="card border-0"
            style="display: flex;
                                        justify-content: flex-start;
                                        height: 100%;"
        >
            <div class="card-header d-flex justify-content-between">
                <h6 style="margin: .5rem;">
                    <fa-icon icon="filter" class="mr-2"></fa-icon>
                    Selecionar Filtro
                </h6>
                <button class="btn btn-outline-dark btn-sm" (click)="showPanel = false">
                    FECHAR
                    <fa-icon icon="times" class="ml-2"></fa-icon>
                </button>
            </div>
            <div
                class="card-body scroll-style"
                style="max-height: calc(100% - 65px);overflow-x: hidden;overflow-y: auto;"
            >
                <ul class="list-group">
                    <li class="list-group-item filter-item" *ngFor="let item of filters" (click)="_selectFilter(item)">
                        {{ item.name }}
                    </li>
                </ul>
            </div>
            <div class="card-footer text-muted d-flex justify-content-end">
                <button class="btn btn-outline-primary mb-2" (click)="createFilter()">
                    Criar Filtro
                    <fa-icon icon="plus" class="mr-2"></fa-icon>
                </button>
            </div>
        </div>
        <fb-modal-panel [showPainel]="stateFilterPanel">
            <fb-filter-maker
                #fbFilter
                (addFilter)="_selectFilter($event)"
                [columnsData]="columnsData"
                [(showPanel)]="stateFilterPanel"
            ></fb-filter-maker>
        </fb-modal-panel>
    `,
    styleUrls: ['./filter-selector.component.scss']
})
export class FilterSelectorComponent {
    @Output() showPanelChange = new EventEmitter();
    @Output() addFilter = new EventEmitter();
    @Output() selectFilter = new EventEmitter<FilterModel>();
    @Input() columnsData: DataSourceKey[] = [];
    @Input() filters: FilterModel[] = [];

    stateFilterPanel = false;

    @Input() set showPanel(value: boolean) {
        this.showPanelChange.emit(value);
        this._showPanel = value;
    }

    get showPanel(): boolean {
        return this._showPanel;
    }

    private _showPanel = false;

    createFilter = () => {
        this.stateFilterPanel = true;
    };

    _selectFilter(filter: FilterModel): void {
        this.selectFilter.emit(filter);
        this.showPanel = false;
    }
}
