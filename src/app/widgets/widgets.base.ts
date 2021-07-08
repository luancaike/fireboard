import { FieldEditor } from './widgets.field-editor';
import { LegoConfig } from 'ng-craftable/lib/model';
import { ChangeDetectorRef } from '@angular/core';

export class WidgetsBase {
    public legoData: LegoConfig;
    public isLoading: boolean;
    public dataSource: number = null;
    protected cdr: ChangeDetectorRef;
    protected dataSourceBindOptions: any[];
    protected options: { [key: string]: any } = {};
    protected data: any[] = [];
    protected dataSourceSelectKeys: any[] = [];
    protected fieldsEditor: FieldEditor[];

    getConfig(): any {
        return {
            dataSourceSelectKeys: this.dataSourceSelectKeys,
            dataSourceBindOptions: this.dataSourceBindOptions,
            dataSource: this.dataSource,
            options: this.options
        };
    }

    setConfig({ dataSource, options, dataSourceBindOptions, dataSourceSelectKeys }): void {
        this.dataSourceSelectKeys = dataSourceSelectKeys;
        this.dataSource = dataSource;
        this.setDataSourceBindOptions(dataSourceBindOptions);
        this.setOptions(options);
    }

    getOptions(): any {
        return this.options;
    }

    setDataSourceBindOptions(dataSourceBindOptions: any): void {
        this.dataSourceBindOptions = dataSourceBindOptions;
        this.cdr.detectChanges();
    }

    setOptions(options: { [key: string]: any }): void {
        this.options = options;
        this.cdr.detectChanges();
    }

    setData(data: any[]): void {
        this.data = data;
        this.cdr.detectChanges();
    }

    getPropertiesEditor(): FieldEditor[] {
        return this.fieldsEditor;
    }
}
