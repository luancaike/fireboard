import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    QueryList,
    ViewChildren,
    ViewEncapsulation
} from '@angular/core';
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
import { EDITOR_FK_SYMBOLS } from '../expression-builder/models';
import { ExpressionBuilderComponent } from '../expression-builder/expression-builder.component';

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

    constructor(public fireboardDataService: FireboardDataService, private cdr: ChangeDetectorRef) {}

    @Input() set showPanel(value: boolean) {
        this.showPanelChange.emit(value);
        this._showPanel = value;
    }

    get showPanel(): boolean {
        return this._showPanel;
    }

    public get isValid() {
        return this.name && this.name.length && this.model?.table?.id;
    }

    private _showPanel = false;
    public previewCollapsed = true;
    public previewQueryResult = {
        query: '',
        result: [],
        columns: []
    };
    public name: string;
    public id: number;
    public selectedCustomColumn: DataSourceKey;
    public selectedColumnFilter: DataSourceKey;
    public selectedOperator;
    public operatorsFilter: FilterOperator[] = [];
    public operatorsValues: FilterValuesSqlBuild[] = [];
    public model: ModelSqlBuild = getDefaultModel();

    get tablesOfModel(): DataSource[] {
        const baseColumns = this.model?.table ? [this.getTableSchema(this.model?.table?.id)] : [];
        const forkColumns =
            this.model?.forks?.reduce((acc, item) => {
                if (item?.table) {
                    acc.push(this.getTableSchema(item?.table?.id));
                }
                return acc;
            }, []) || [];
        return [...baseColumns, ...forkColumns];
    }

    get columnsOfModel(): DataSourceKey[] {
        return this.tablesOfModel.reduce((acc, item) => {
            return [
                ...acc,
                ...this.getColumnsTableSchema(item.id).map((el) => ({
                    ...el,
                    name: `${item.name}${EDITOR_FK_SYMBOLS.default}${el.name}`
                }))
            ];
        }, []);
    }

    get filterIsValid(): boolean {
        return this.selectedColumnFilter && this.selectedOperator && this.operatorsValues.every((el) => !!el.value);
    }

    public trackByValorFilter = (index: number, item: any) => {
        return item;
    };

    public selectTable = (table: DataSource) => {
        this.model = getDefaultModel();
        this.model.table = table;
        this.closeAllPopovers();
    };
    public trackById = (index: number, item: any) => {
        return item?.id;
    };
    public addSelect = (table: DataSourceKey) => {
        this.model.select.push(table);
        this.closeAllPopovers();
    };
    public addCustomColumn = (table: any) => {
        this.model.select.push(table);
        this.closeAllPopovers();
    };
    public editCustomColumn = (table: any) => {
        const result = this.model.select.find((el) => el === this.selectedCustomColumn);
        if (result) {
            result.name = table.name;
            result.source = table.source;
            result.expression = table.expression;
        }
        this.selectedCustomColumn = null;
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

    getTableSchema(id): DataSource {
        return this.tables.find((el) => el.id === id);
    }

    getColumnsTableSchema(id): DataSourceKey[] {
        const result = this.getTableSchema(id);
        return result ? result.columns : [];
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
        this.previewQueryResult = {
            query: '',
            result: [],
            columns: []
        };
        this.name = '';
        this.id = null;
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
        delete newModel.table.name;

        newModel.select = newModel.select.map(({ id, expression, type, name, source }) => ({
            id,
            expression,
            type,
            name,
            source
        }));
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
                columnPrimary: { id: item.columnPrimary.id },
                columnSecondary: { id: item.columnSecondary.id }
            }));
        return newModel;
    }

    selectColumn(
        mouseEvent: MouseEvent,
        popover: PopoverComponent,
        expression: ExpressionBuilderComponent,
        item: DataSourceKey
    ) {
        this.selectedCustomColumn = null;
        if (item.type === DataSourceKeyTypes.Custom) {
            this.selectedCustomColumn = item;
            popover.show(mouseEvent);
            expression.columnTitle = item.name;
            expression.renderText(item.source);
        }
    }

    previewModel() {
        this.fireboardDataService.previewDataSource(this.getModelToSave()).subscribe(({ data }) => {
            this.previewQueryResult.query = data.query;
            this.previewQueryResult.result = data.result;
            this.previewQueryResult.columns = data.columns.map(({ name }) => name);
            this.cdr.detectChanges();
        });
    }

    viewQuerySql() {
        alert(this.previewQueryResult.query);
    }

    editModel(id) {
        this.getModelExternal(id);
    }

    saveThisModel() {
        const model = {
            name: this.name,
            queryModel: this.getModelToSave()
        };
        if (this.id) {
            this.fireboardDataService.updateDataSource(this.id, model).subscribe(() => {
                this.closePanel();
                this.fireboardDataService.updateDataSources();
            });
        } else {
            this.fireboardDataService.addDataSource(model).subscribe(() => {
                this.closePanel();
                this.fireboardDataService.updateDataSources();
            });
        }
    }

    setModel(model) {
        this.id = model.id;
        this.name = model.name;
        this.model = model.queryModel;
        this.expandByModel();
        this.cdr.detectChanges();
    }

    expandByModel() {
        Object.keys(this.model).forEach((key) => {
            const checkValue = (value) => (Array.isArray(value) ? !!value.length : !!value);
            const sqlBuildContainer = document.querySelector(`.sql-build-container`);
            const element = sqlBuildContainer.querySelector(`.${key}-box`);
            if (element) {
                if (checkValue(this.model[key])) {
                    element.classList.remove('collapsed');
                } else {
                    element.classList.add('collapsed');
                }
            }
        });
    }

    private getModelExternal(id) {
        this.fireboardDataService.getDataSource(id).subscribe(({ data }) => {
            this.setModel(data);
            console.log(data);
        });
    }
}
