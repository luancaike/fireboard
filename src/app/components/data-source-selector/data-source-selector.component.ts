import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild
} from '@angular/core';
import { DataSourceBindOption, DataSourceSelectedKey, WidgetConfig } from '../../widgets/widget.abstract';
import { DataSource, DataSourceKey, FilterModel } from '../../models/data-source.dtos';
import { FilterSelectorComponent } from '../filter-selector/filter-selector.component';
import { LoadingBarService } from '../../service/loading-bar.service';
import { ExternalDataService } from '../../service/external-data.service';

@Component({
    selector: 'fb-data-source-selector',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './data-source-selector.component.html',
    styleUrls: ['./data-source-selector.component.scss']
})
export class DataSourceSelectorComponent {
    @ViewChild('fbFilter') fbFilter: FilterSelectorComponent;

    @Input() public dataSources: DataSource[];

    @Output() public changedDataSource = new EventEmitter<WidgetConfig>();

    public stateFilterPanel = false;
    public dataSourceKeys: DataSourceKey[] = [];
    public dataSourceSelected: number = null;
    public legoConfig: WidgetConfig = null;
    public dataSourceBindOptions: DataSourceBindOption[] = [];
    public filters: FilterModel[] = [];
    public filtersSelected: FilterModel[] = [];
    public dataSourceSelectedKeys: Map<string, DataSourceSelectedKey> = new Map();
    public bindingsIds: string[] = [];

    constructor(
        protected cdr: ChangeDetectorRef,
        public loadingBarService: LoadingBarService,
        public externalDataService: ExternalDataService
    ) {}

    showFilterPanel() {
        this.stateFilterPanel = true;
        const dataSource = this.dataSources.find(({ id }) => this.dataSourceSelected === id);

        if (dataSource) {
            this.fbFilter.columnsData = dataSource.keys;
            this.getAndSetFilters();
        }
    }

    getAndSetFilters() {
        if (this.externalDataService.filtersGetter && this.dataSourceSelected) {
            this.loadingBarService.show();
            this.externalDataService.filtersGetter(this.dataSourceSelected).then((data) => {
                this.filters = data;
                this.loadingBarService.hide();
            });
        }
    }

    editLego(legoConfig: WidgetConfig): void {
        this.legoConfig = legoConfig;
        this.resetData();
        this.selectDataSource();
        this.mountDataSourceBindOptions();
        this.mountDataSourceKeys();
        this.mountFilters();
        this.cdr.detectChanges();
    }

    resetData(): void {
        this.dataSourceKeys = [];
        this.dataSourceSelectedKeys.clear();
    }

    selectFilter(filter: FilterModel): void {
        this.filtersSelected = [...this.filtersSelected, filter];
        this.changedFiltersSelected();
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
            const keys = this.legoConfig.dataSourceBindOptions.map(({ key }) => key);
            keys.forEach((key) => {
                const result = this.legoConfig.dataSourceSelectedKeys.find((el) => el.key === key);
                if (result) {
                    this.dataSourceSelectedKeys.set(key, result);
                } else {
                    this.dataSourceSelectedKeys.set(key, {
                        key,
                        data: []
                    });
                }
            });
        }
    }

    mountFilters(): void {
        if (Array.isArray(this.legoConfig.filters)) {
            this.filtersSelected = this.legoConfig.filters;
        }
    }

    clearDataSourceKeys(): void {
        if (Array.isArray(this.legoConfig.dataSourceBindOptions)) {
            const keys = this.legoConfig.dataSourceBindOptions.map(({ key }) => key);
            keys.forEach((key) => {
                this.dataSourceSelectedKeys.set(key, {
                    key,
                    data: []
                });
            });
        }
    }

    removeItemOfArray(item: unknown, array: any[]): void {
        const index = array.indexOf(item);
        if (~index) {
            array.splice(index, 1);
        }
    }

    removeKey(item: unknown, array: any[]): void {
        this.removeItemOfArray(item, array);
        this.changedKeysSelected();
    }

    removeFilter(item: unknown, array: any[]): void {
        this.removeItemOfArray(item, array);
        this.changedFiltersSelected();
    }

    updateLegoKeysBySelections(): void {
        const result = this.dataSources.find((el) => el.id === this.dataSourceSelected);
        if (result) {
            this.dataSourceKeys = result.keys;
        }
    }

    changedDatasource(): void {
        this.updateLegoKeysBySelections();
        this.clearDataSourceKeys();
        this.changedDataSource.emit({ dataSource: this.dataSourceSelected });
    }

    changedKeysSelected(): void {
        this.changedDataSource.emit({ dataSourceSelectedKeys: Array.from(this.dataSourceSelectedKeys.values()) });
    }

    changedFiltersSelected(): void {
        this.changedDataSource.emit({ filters: this.filtersSelected });
    }

    drop(event: CdkDragDrop<DataSourceKey[]>): void {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }
        this.changedKeysSelected();
    }

    dropFilter(event: CdkDragDrop<FilterModel[]>): void {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }
        this.changedFiltersSelected();
    }
}
