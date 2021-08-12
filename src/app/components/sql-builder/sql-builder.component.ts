import { Component, EventEmitter, Input, Output, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { PopoverComponent } from '../popover/popover.component';
import { DataSource, DataSourceKey, DataSourceKeyTypes } from '../../models/data-source.dtos';
import {
    FilterOperator,
    FilterOperatorsDate,
    FilterOperatorsNumber,
    FilterOperatorsString,
    FilterValuesSqlBuild,
    getDefaultModel,
    getDefaultModelJoin,
    JoinType,
    ModelSqlBuild
} from './sql-builder.model';
import { FlatCopy } from '../../utils/objects';
import { FireboardDataService } from '../../service/fireboard-data.service';

@Component({
    selector: 'fb-sql-builder',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './sql-builder.component.html',
    styleUrls: ['./sql-builder.component.scss']
})
export class SqlBuilderComponent {
    @ViewChildren(PopoverComponent) popovers: QueryList<PopoverComponent>;
    @Output() showPanelChange = new EventEmitter();
    @Output() save = new EventEmitter<ModelSqlBuild>();
    @Input() tables: DataSource[] = [];

    constructor(public fireboardDataService: FireboardDataService) {}

    @Input() set showPanel(value: boolean) {
        this.showPanelChange.emit(value);
        this._showPanel = value;
    }

    get showPanel(): boolean {
        return this._showPanel;
    }

    private _showPanel = false;
    public selectedColumnFilter: DataSourceKey;
    public selectedOperator;
    public operatorsFilter: FilterOperator[] = [];
    public operatorsValues: FilterValuesSqlBuild[] = [];
    public model: ModelSqlBuild = getDefaultModel();

    get tablesOfModel() {
        const baseColumns = this.model?.table ? [this.model?.table] : [];
        const forkColumns =
            this.model?.forks?.reduce((acc, item) => {
                if (item?.table) {
                    acc.push(item?.table);
                }
                return acc;
            }, []) || [];
        // const customColumns = this.model?.select?.filter((el) => el.type === DataSourceKeyTypes.Custom);
        return [...baseColumns, ...forkColumns];
    }

    get filterIsValid(): boolean {
        return this.selectedColumnFilter && this.selectedOperator && this.operatorsValues.every((el) => !!el.value);
    }

    get columnsOfModel() {
        return this.tablesOfModel.reduce((acc, item) => {
            return [...acc, ...item.keys.map((el) => ({ ...el, name: `${item.name} → ${el.name}` }))];
        }, []);
    }

    public trackByValorFilter = (index: number, item: any) => {
        return item;
    };

    public selectTable = (table: DataSource) => {
        this.model = getDefaultModel();
        this.model.table = table;
        this.closeAllPopovers();
    };
    public addSelect = (table: DataSourceKey) => {
        this.model.select.push(table);
        this.closeAllPopovers();
    };
    public addCustomColumn = (table: any) => {
        this.model.select.push(table);
        this.closeAllPopovers();
    };
    public addFork = () => {
        this.model.forks.push(getDefaultModelJoin());
        this.closeAllPopovers();
    };
    public addGroup = (table: any) => {
        this.model.group.push(table);
        this.closeAllPopovers();
    };
    public addOrder = (table: any) => {
        table.direction = 'up';
        this.model.order.push(table);
        this.closeAllPopovers();
    };
    public removeItem = (data: any[], item: any) => {
        data.splice(data.indexOf(item), 1);
    };
    public toggleOrderDirection = (item: any) => {
        item.direction = item.direction === 'up' ? 'down' : 'up';
    };
    public selectForkKey = (indexOfFork: number, key: string) => (table: any) => {
        const fork = this.model.forks[indexOfFork];
        fork[key] = table;
        switch (key) {
            case 'table':
                fork.columnSecondary = null;
        }
        this.closeAllPopovers();
    };

    closeAllPopovers(): void {
        this.popovers.forEach((popover) => popover.hide());
    }

    resetFilterSelector(): void {
        this.selectedColumnFilter = undefined;
        this.selectedOperator = undefined;
        this.operatorsFilter = [];
        this.operatorsValues = [];
    }

    openBox(element: HTMLElement) {
        if (!!~element.className.indexOf('collapsed')) {
            element.classList.remove('collapsed');
        }
    }

    toggleForkType(index: number) {
        if (this.model.forks[index].joinType >= 3) {
            this.model.forks[index].joinType = 1;
        } else {
            ++this.model.forks[index].joinType;
        }
    }

    onSelectedFilter(filter: DataSourceKey) {
        this.selectedColumnFilter = filter;
        switch (this.selectedColumnFilter.type) {
            case DataSourceKeyTypes.Boolean:
                break;
            case DataSourceKeyTypes.String:
                this.operatorsFilter = FilterOperatorsString;
                break;
            case DataSourceKeyTypes.Date:
                this.operatorsFilter = FilterOperatorsDate;
                break;
            case DataSourceKeyTypes.Number:
                this.operatorsFilter = FilterOperatorsNumber;
                break;
            case DataSourceKeyTypes.Custom:
                break;
        }
    }

    addFilter() {
        const model = {
            values: this.operatorsValues,
            operator: this.selectedOperator,
            column: this.selectedColumnFilter
        };
        this.model.filters.push(model);
        this.resetFilterSelector();
    }

    mapValuesToString(values: any[]): string {
        const valueIsDate = (value: any) => typeof value === 'string' && new Date(value).toString() !== 'Invalid Date';
        return values
            .map(({ value }) => (valueIsDate(value) ? new Date(value).toLocaleDateString('pt-Br') : value))
            .toString();
    }

    onSelectedOperator(operator: FilterOperator) {
        this.operatorsValues = new Array(operator.amountValues).fill(null).map(() => ({
            value: null,
            type: this.selectedColumnFilter.type
        }));
    }

    closePanel() {
        this.showPanel = false;
        this.model = getDefaultModel();
    }

    clearModelField(field: string, element: HTMLElement) {
        element.classList.add('collapsed');
        if (field === 'forks') {
            this.model.forks = [
                {
                    table: null,
                    joinType: JoinType.Left,
                    columnPrimary: null,
                    columnSecondary: null
                }
            ];
        } else if (Array.isArray(this.model[field])) {
            this.model[field] = [];
        } else {
            this.model[field] = null;
        }
    }

    getModelToSave() {
        const newModel: { [key: string]: any } | ModelSqlBuild = FlatCopy<ModelSqlBuild>(this.model);

        delete newModel.table.columns;

        newModel.select = newModel.select.map(({ id }) => ({ id }));
        newModel.group = newModel.group.map(({ id }) => ({ id }));
        newModel.order = newModel.order.map(({ id, direction }) => ({ id, direction }));
        newModel.filters = newModel.filters.map((item) => ({
            ...item,
            values: item.values.map((el) => ({
                ...el,
                value: el.type === 'date' ? new Date(el.value).toISOString() : el.value
            })),
            operator: item.operator.id,
            column: { id: item.column.id }
        }));
        newModel.forks = newModel.forks
            .filter((item) => !!item?.table?.id)
            .map((item) => ({
                ...item,
                table: { id: item.table.id },
                columnPrimary: { id: item.table.id },
                columnSecondary: { id: item.table.id }
            }));
        return newModel;
    }

    previewModel() {
        this.fireboardDataService.previewDataSource(this.getModelToSave()).then(({ data }) => {
            console.log(data.query);
            console.table(data.result);
        });
    }

    saveThisModel() {
        this.save.emit(this.model);
        //this.closePanel();
    }
}
