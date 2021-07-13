import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { DataSourceBindOption, DataSourceSelectedKey, WidgetConfig } from '../../widgets/widget.abstract';
import { DataSource, DataSourceKey } from '../../models/data-source.dtos';

@Component({
    selector: 'fb-data-source-selector',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './data-source-selector.component.html',
    styleUrls: ['./data-source-selector.component.scss']
})
export class DataSourceSelectorComponent {
    @Input() public dataSources: DataSource[];
    @Output() public changedDataSource = new EventEmitter<WidgetConfig>();
    public dataSourceKeys: DataSourceKey[] = [];
    public dataSourceSelected: number = null;
    public legoConfig: WidgetConfig = null;
    public dataSourceBindOptions: DataSourceBindOption[] = [];
    public dataSourceSelectedKeys: Map<string, DataSourceSelectedKey> = new Map();
    public bindingsIds: string[] = [];

    constructor(protected cdr: ChangeDetectorRef) {}

    editLego(legoConfig: WidgetConfig): void {
        this.legoConfig = legoConfig;
        this.resetData();
        this.selectDataSource();
        this.mountDataSourceBindOptions();
        this.mountDataSourceKeys();
        this.cdr.detectChanges();
    }

    resetData(): void {
        this.dataSourceKeys = [];
        this.dataSourceSelectedKeys.clear();
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
        this.changedKeysSelected();
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

    drop(event: CdkDragDrop<DataSourceKey[]>): void {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }
        this.changedKeysSelected();
    }
}
