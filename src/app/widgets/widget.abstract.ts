import { FieldEditor } from './field-editor.dtos';
import { LegoConfig } from 'ng-craftable/lib/model';
import { ChangeDetectorRef } from '@angular/core';
import { DataSourceKey, DataSourceKeyTypes } from '../models/data-source.dtos';
import { WidgetComponent } from './widget.interface';

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
    options?: WidgetOptions;
}

export type WidgetOptions = { [key: string]: any };

export interface DataGetter {
    id?: number;
}

export abstract class WidgetAbstract implements WidgetComponent {
    public legoData: LegoConfig;
    public dataGetter: (data: DataGetter) => Promise<any[]>;
    public isLoading: boolean;
    public dataSource: number = null;
    public dataSourceBindOptions: DataSourceBindOption[] = [];
    public dataSourceSelectedKeys: DataSourceSelectedKey[] = [];
    public options: WidgetOptions = {};
    public data: any[] = [];
    public fieldsEditor: FieldEditor[] = [];

    constructor(protected cdr: ChangeDetectorRef) {}

    getConfig(): WidgetConfig {
        return {
            dataSourceSelectedKeys: this.dataSourceSelectedKeys,
            dataSourceBindOptions: this.dataSourceBindOptions,
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
        if (this.checkValidityForGetData()) {
            this.getData().then((data) => {
                this.setData(data);
                this.applyComponentData();
            });
        }
    }

    async getData(): Promise<any[]> {
        if (this.dataSource && this.dataGetter) {
            return await this.dataGetter({ id: this.dataSource });
        }
        return [];
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

    setData(data: any[]): void {
        this.data = data;
        this.cdr.detectChanges();
    }

    abstract applyComponentData(): void;
}
