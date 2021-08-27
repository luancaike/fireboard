import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { DataSourceBindOption, DataSourceBindOptionRules, WidgetConfig } from '../../widgets/widget.abstract';
import { DataSource, DataSourceKey, DataSourceSelected, FilterModel } from '../../models/data-source.dtos';
import { FilterSelectorComponent } from '../filter-selector/filter-selector.component';
import { LoadingBarService } from '../../service/loading-bar.service';
import { FireboardDataService } from '../../service/fireboard-data.service';

@Component({
    selector: 'fb-data-source-selector',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './data-source-selector.component.html',
    styleUrls: ['./data-source-selector.component.scss']
})
export class DataSourceSelectorComponent implements OnChanges {
    @ViewChild('fbFilter') fbFilter: FilterSelectorComponent;

    @Input() public dataSources: DataSource[];
    @Input() legoConfig: WidgetConfig = null;
    @Output() public changedDataSource = new EventEmitter<WidgetConfig>();

    public showFilters = true;
    public stateFilterPanel = false;
    public dataSourceKeys: DataSourceKey[] = [];
    public dataSourceSelected: DataSourceSelected = null;
    public dataSourceBindOptions: DataSourceBindOption[] = [];
    public filters: FilterModel[] = [];
    public filtersSelected: FilterModel[] = [];
    public dataSourceSelectedKeys: { [key: string]: any } = {};
    public dataSourceKeysItems: { [key: string]: DataSourceKey[] } = {};
    public bindingsIds: string[] = [];

    constructor(
        protected cdr: ChangeDetectorRef,
        public loadingBarService: LoadingBarService,
        public fireboardDataService: FireboardDataService
    ) {}

    changedKeysSelected = (key) => (value) => {
        this.dataSourceSelectedKeys[key] = value;
        this.emitSelectedKeys();
    };

    emitSelectedKeys() {
        const model = {
            dataSourceSelectedKeys: Object.keys(this.dataSourceSelectedKeys).map((key) => {
                let data = this.dataSourceSelectedKeys[key];
                if (!!data && !Array.isArray(data)) {
                    data = [data];
                }
                return {
                    key,
                    data
                };
            })
        };
        this.changedDataSource.emit(model);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.legoConfig) {
            this.editLego();
        }
    }

    editLego(): void {
        this.resetData();
        this.selectDataSource();
        this.mountDataSourceBindOptions();
        this.mountDataSourceKeys();
        this.updateDataSourceKeysItems();
        this.cdr.detectChanges();
    }

    resetData(): void {
        this.dataSourceKeys = [];
        this.dataSourceSelectedKeys = {};
    }

    selectDataSource(): void {
        if (this.legoConfig.dataSource) {
            this.dataSourceSelected = this.legoConfig.dataSource;
        } else {
            this.dataSourceSelected = null;
        }
        this.updateLegoKeysBySelections();
        this.cdr.detectChanges();
    }

    mountDataSourceBindOptions(): void {
        if (Array.isArray(this.legoConfig.dataSourceBindOptions)) {
            this.dataSourceBindOptions = this.legoConfig.dataSourceBindOptions;
            this.bindingsIds = this.legoConfig.dataSourceBindOptions.map(({ key }) => key);
        }
    }

    mountDataSourceKeys(): void {
        if (Array.isArray(this.legoConfig.dataSourceBindOptions)) {
            this.legoConfig.dataSourceBindOptions.forEach((item) => {
                const key = item.key;
                const result = this.legoConfig.dataSourceSelectedKeys.find((el) => el.key === key);
                if (result) {
                    this.dataSourceSelectedKeys[key] = (
                        item.rules.max !== undefined && item.rules.max !== null ? item.rules.max > 1 : true
                    )
                        ? result.data
                        : result.data[0];
                } else {
                    this.dataSourceSelectedKeys[key] = [];
                }
            });
        }
    }

    clearDataSourceKeys(): void {
        if (Array.isArray(this.legoConfig.dataSourceBindOptions)) {
            this.legoConfig.dataSourceBindOptions.forEach((value) => {
                this.dataSourceSelectedKeys[value.key] = [];
            });
        }
    }

    updateDataSourceKeysItems() {
        if (Array.isArray(this.legoConfig.dataSourceBindOptions)) {
            this.legoConfig.dataSourceBindOptions.forEach((value) => {
                this.dataSourceKeysItems[value.key] = this.dataSourcesFilterByRules(value.rules);
            });
        }
    }

    updateLegoKeysBySelections(): void {
        const result = this.dataSources.find((el) => el.id === this.dataSourceSelected);
        if (result) {
            this.dataSourceKeys = result.columns;
        }
    }

    dataSourcesFilterByRules(rules: DataSourceBindOptionRules) {
        return this.dataSourceKeys.filter(
            (el) => !Array.isArray(rules.allowTypes) || rules.allowTypes.find((type) => type === el.type)
        );
    }

    updateDatasource(value): void {
        this.dataSourceSelected = value;
        this.updateLegoKeysBySelections();
        this.clearDataSourceKeys();
        this.updateDataSourceKeysItems();
        this.changedDataSource.emit({ dataSource: this.dataSourceSelected });
        this.cdr.detectChanges();
    }
}
