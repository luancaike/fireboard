import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
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
import { DataSourceBindOption, DataSourceSelectedKey, WidgetConfig } from '../../widgets/widget.abstract';
import { DataSource, DataSourceKey, DataSourceSelected, FilterModel } from '../../models/data-source.dtos';
import { FilterSelectorComponent } from '../filter-selector/filter-selector.component';
import { LoadingBarService } from '../../service/loading-bar.service';
import { FireboardDataService } from '../../service/fireboard-data.service';
import { CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop/drag-events';

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
    public dataSourceSelectedKeys: Map<string, DataSourceSelectedKey> = new Map();
    public bindingsIds: string[] = [];

    constructor(
        protected cdr: ChangeDetectorRef,
        public loadingBarService: LoadingBarService,
        public fireboardDataService: FireboardDataService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.legoConfig) {
            this.editLego();
        }
    }

    showFilterPanel() {
        this.stateFilterPanel = true;
        const dataSource = this.dataSources.find(({ id }) => this.dataSourceSelected === id);

        if (dataSource) {
            this.fbFilter.columnsData = dataSource.columns;
            this.getAndSetFilters();
        }
    }

    checkEnterItem(drag: CdkDragEnter<DataSourceKey[], DataSourceKey>) {
        const allowed = this.checkRules(drag);
        if (!allowed) {
            console.log(drag.container.element.nativeElement.classList.toString());
            drag.container.element.nativeElement.classList.add('not-allowed');
        }
    }

    checkRules(drag: CdkDragEnter<DataSourceKey[], DataSourceKey>) {
        let max = true;
        let allowTypes = true;
        const bind = this.dataSourceBindOptions.find((el) => el.key === drag.container.id);
        if (bind && bind.rules) {
            if (bind.rules.max) {
                max = drag.container.data.length < bind.rules.max;
            }
            if (bind.rules.allowTypes) {
                allowTypes = !!bind.rules.allowTypes.find((type) => type === drag.item.data.type);
            }
        }
        return max && allowTypes;
    }

    checkExitItem(drag: CdkDragExit<DataSourceKey[], DataSourceKey>) {
        this.resetDropAreaStyle(drag.container.element.nativeElement);
    }

    resetDropAreaStyle(element: HTMLElement) {
        element.classList.remove('not-allowed');
    }

    getAndSetFilters() {
        if (this.fireboardDataService.getExternalFilters && this.dataSourceSelected) {
            this.loadingBarService.show();
            this.fireboardDataService.getExternalFilters(this.dataSourceSelected).then((data) => {
                this.filters = data;
                this.loadingBarService.hide();
                this.cdr.detectChanges();
            });
        }
    }

    editLego(): void {
        // this.legoConfig = legoConfig;
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
            this.dataSourceKeys = result.columns;
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
        this.resetDropAreaStyle(event.container.element.nativeElement);
        const allowed = this.checkRules(event);
        if (!allowed) {
            return;
        }
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
