import { FieldEditor } from './field-editor.dtos';
import { LegoConfig } from 'ng-craftable/lib/model';
import { ChangeDetectorRef } from '@angular/core';
import { DataSourceKey, DataSourceKeyTypes, FilterModel } from '../models/data-source.dtos';
import { WidgetComponent } from './widget.interface';
import { ExternalDataService } from '../service/external-data.service';

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
    dataSource?: number;
    filters?: FilterModel[];
    options?: WidgetOptions;
}

export type WidgetOptions = { [key: string]: any };

export interface DataGetter {
    id?: number;
    filters?: FilterModel[];
}

export abstract class WidgetAbstract implements WidgetComponent {
    public legoData: LegoConfig;
    abstract externalDataService: ExternalDataService;
    public isLoading: boolean;
    public dataSource: number = null;
    public dataSourceBindOptions: DataSourceBindOption[] = [];
    public dataSourceSelectedKeys: DataSourceSelectedKey[] = [];
    public options: WidgetOptions = {};
    public filters: FilterModel[] = [];
    public data: any[] = [];
    public fieldsEditor: FieldEditor[] = [];

    constructor(protected cdr: ChangeDetectorRef) {}

    getConfig(): WidgetConfig {
        return {
            dataSourceSelectedKeys: this.dataSourceSelectedKeys,
            dataSourceBindOptions: this.dataSourceBindOptions,
            filters: this.filters,
            dataSource: this.dataSource,
            options: this.options
        };
    }

    getOptions(): WidgetOptions {
        return this.options;
    }

    getPropertiesEditor(): FieldEditor[] {
        return this.fieldsEditor;
    }

    setConfig(widgetConfig: WidgetConfig): void {
        const { dataSource, options, dataSourceBindOptions, dataSourceSelectedKeys, filters } = widgetConfig;
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
        if (filters) {
            this.setFilters(filters);
        }
        if (this.checkValidityForGetData()) {
            this.updateDataAndApplyComponent();
        }
    }

    async getData(): Promise<any[]> {
        if (this.dataSource && this.externalDataService.dataGetter) {
            return await this.externalDataService.dataGetter({ id: this.dataSource, filters: this.filters });
        }
        return [];
    }

    updateDataAndApplyComponent(): void {
        this.getData().then((data) => {
            this.setData(data);
            this.applyComponentData();
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

    setDataSource(dataSource: number): void {
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

    setFilters(filters: FilterModel[]): void {
        this.filters = filters;
        this.updateDataAndApplyComponent();
        this.cdr.detectChanges();
    }

    setData(data: any[]): void {
        this.data = data;
        this.cdr.detectChanges();
    }

    abstract applyComponentData(): void;
}
