import { FieldEditor } from './field-editor.dtos';
import { LegoConfig } from 'ng-craftable/lib/model';
import { ChangeDetectorRef } from '@angular/core';
import { DataSourceKey, DataSourceKeyTypes, DataSourceSelected, FilterModel } from '../models/data-source.dtos';
import { WidgetComponent } from './widget.interface';
import { FireboardDataService } from '../service/fireboard-data.service';
import { FilterQueryTypes } from '../models/filter.dtos';

export interface DataSourceBindOptionRules {
    max?: number;
    required?: boolean;
    allowTypes?: DataSourceKeyTypes[];
}

export interface DataSourceBindOption {
    label: string;
    key: string;
    rules?: DataSourceBindOptionRules;
}

export interface DataSourceSelectedKey {
    key: string;
    data: DataSourceKey[];
}

export interface WidgetConfig {
    dataSourceSelectedKeys?: DataSourceSelectedKey[];
    dataSourceBindOptions?: DataSourceBindOption[];
    dataSource?: DataSourceSelected;
    filters?: FilterModel[];
    options?: WidgetOptions;
}

export type WidgetOptions = { [key: string]: any };

export interface DataGetter {
    sourceId?: DataSourceSelected;
    widgetKey?: string;
}

export abstract class WidgetAbstract implements WidgetComponent {
    abstract legoData: LegoConfig;
    abstract fireboardDataService: FireboardDataService;
    abstract options: WidgetOptions = {};

    public typeFilter: FilterQueryTypes;
    public isFilter = false;
    public isLoading: boolean;
    public dataSource: DataSourceSelected = null;
    public dataSourceBindOptions: DataSourceBindOption[] = [];
    public dataSourceSelectedKeys: DataSourceSelectedKey[] = [];
    public data: any[] = [];
    public fieldsEditor: FieldEditor[] = [];

    private config: WidgetConfig = {};

    constructor(protected cdr: ChangeDetectorRef) {}

    showLoading() {
        this.isLoading = true;
        this.cdr.detectChanges();
    }

    hiddenLoading() {
        this.isLoading = false;
        this.cdr.detectChanges();
    }

    getConfig(): WidgetConfig {
        this.config.dataSourceSelectedKeys = this.dataSourceSelectedKeys;
        this.config.dataSourceBindOptions = this.dataSourceBindOptions;
        this.config.dataSource = this.dataSource;
        this.config.options = this.getOptions();
        return this.config;
    }

    getOptions(): WidgetOptions {
        return this.options;
    }

    getPropertiesEditor(): FieldEditor[] {
        return this.fieldsEditor;
    }

    setConfig(widgetConfig: WidgetConfig): void {
        const { dataSource, options, dataSourceBindOptions, dataSourceSelectedKeys } = widgetConfig;
        if (dataSourceSelectedKeys) {
            this.setDataSourceSelectKeys(dataSourceSelectedKeys);
        }
        if (dataSource) {
            this.setDataSource(dataSource);
        }
        if (dataSourceBindOptions) {
            this.setDataSourceBindOptions(dataSourceBindOptions);
        }
        if (options) {
            this.setOptions(options);
        }
        if ((dataSourceSelectedKeys || dataSource) && this.checkValidityForGetData()) {
            this.updateDataAndApplyComponent();
        }
    }

    async getData(): Promise<any[]> {
        if (this.dataSource && this.fireboardDataService.dataGetter) {
            return await this.fireboardDataService.dataGetter({
                sourceId: this.dataSource,
                widgetKey: this.legoData.key
            });
        }
        return [];
    }

    updateDataAndApplyComponent(): void {
        this.showLoading();
        this.getData().then((data) => {
            this.setData(data);
            this.applyComponentData();
            this.hiddenLoading();
        });
    }

    checkValidityForGetData(): boolean {
        return this.dataSourceBindOptions.every((option) => {
            if (!option.rules.required) {
                return true;
            }
            return !!this.dataSourceSelectedKeys.find((data) => data.key === option.key)?.data.length;
        });
    }

    setDataSourceSelectKeys(dataSourceSelectedKeys: DataSourceSelectedKey[]): void {
        this.dataSourceSelectedKeys = dataSourceSelectedKeys;
        this.cdr.detectChanges();
    }

    setDataSource(dataSource: DataSourceSelected): void {
        this.dataSource = dataSource;
        this.cdr.detectChanges();
    }

    setDataSourceBindOptions(dataSourceBindOptions: DataSourceBindOption[]): void {
        this.dataSourceBindOptions = dataSourceBindOptions;
        this.cdr.detectChanges();
    }

    setOptions(options: WidgetOptions): void {
        this.options = options;
        this.cdr.detectChanges();
    }

    setData(data: any[]): void {
        this.data = data;
        this.cdr.detectChanges();
    }

    abstract applyComponentData(): void;
}
