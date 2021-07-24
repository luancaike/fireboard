import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { WidgetComponent } from '../widget.interface';
import { TableDefault } from './table.default';
import { FireboardDataService } from '../../service/fireboard-data.service';
import { WidgetAbstract, WidgetOptions } from '../widget.abstract';
import { DataSourceKey } from '../../models/data-source.dtos';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';

@Component({
    selector: 'fb-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <fb-loading-widget [show]="isLoading"></fb-loading-widget>
        <div style="display: block; height: 100%">
            <ag-grid-angular [gridOptions]="options" class="ag-theme-fresh" style="height: 100%; width: 100%;">
            </ag-grid-angular>
        </div>
    `
})
export class TableComponent extends WidgetAbstract implements WidgetComponent, AfterViewInit {
    @Input() public legoData;

    public dataSourceBindOptions = TableDefault.dataSourceBindOptions();
    public options: GridOptions = TableDefault.options();
    public fieldsEditor = TableDefault.fieldsEditor();

    constructor(protected cdr: ChangeDetectorRef, public fireboardDataService: FireboardDataService) {
        super(cdr);
    }

    ngAfterViewInit() {
        if (this.legoData.data) {
            this.setConfig(this.legoData.data);
        }
    }

    applyComponentData(): void {
        this.dataSourceSelectedKeys.forEach((value) => {
            if (value.key === 'datasets') {
                this.mountColumns(value.data);
                this.mountRows();
            }
        });
        this.cdr.detectChanges();
    }

    setOptions(options: GridOptions) {
        this.setColumns(options.columnDefs);
        this.cdr.detectChanges();
    }

    getOptions(): WidgetOptions {
        const exportOptions: GridOptions = { ...this.options };
        delete exportOptions.api;
        delete exportOptions.columnApi;
        delete exportOptions.rowData;

        return exportOptions;
    }

    mountColumns(labelKeys: DataSourceKey[]): void {
        const columnDefs = labelKeys.map((el) => ({ headerName: el.name, field: el.key, width: 100 }));
        this.setColumns(columnDefs);
    }

    setColumns(columnDefs: (ColDef | ColGroupDef)[]) {
        if (this.options.api) {
            this.options.api.setColumnDefs(columnDefs);
        }
        this.options.columnDefs = columnDefs;
    }

    mountRows(): void {
        if (this.options.api) {
            this.options.api.setRowData(this.data);
        }
    }
}
