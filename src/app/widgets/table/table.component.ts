import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { WidgetComponent } from '../widget.interface';
import { TableDefault } from './table.default';
import { FireboardDataService } from '../../service/fireboard-data.service';
import { WidgetAbstract, WidgetOptions } from '../widget.abstract';
import { DataSourceKey } from '../../models/data-source.dtos';
import { ColDef, GridOptions } from 'ag-grid-community';
import { FieldEditorTypes } from '../field-editor.dtos';

@Component({
    selector: 'fb-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <fb-loading-widget [show]="isLoading"></fb-loading-widget>
        <div style="display: block; height: 100%">
            <ag-grid-angular
                *ngIf="showGrid"
                [gridOptions]="options"
                class="ag-theme-fresh"
                style="height: 100%; width: 100%;"
            >
            </ag-grid-angular>
        </div>
    `
})
export class TableComponent extends WidgetAbstract implements WidgetComponent, AfterViewInit {
    @Input() public legoData;

    public showGrid = true;
    public dataSourceBindOptions = TableDefault.dataSourceBindOptions();
    public options: GridOptions = TableDefault.options();
    public fieldsEditor = TableDefault.fieldsEditor();
    public columnDefs: ColDef[] = [];

    constructor(protected cdr: ChangeDetectorRef, public fireboardDataService: FireboardDataService) {
        super(cdr);
    }

    ngAfterViewInit() {
        if (this.legoData.data) {
            this.setConfig(this.legoData.data);
            this.updateDataAndApplyComponent();
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
        this.columnDefs = options.columnDefs;
        this.setColumns();
    }

    getOptions(): WidgetOptions {
        const exportOptions: GridOptions = { ...this.options };
        delete exportOptions.api;
        delete exportOptions.columnApi;
        delete exportOptions.rowData;

        return exportOptions;
    }

    mountColumns(labelKeys: DataSourceKey[]): void {
        this.columnDefs = labelKeys.map((el, i) => ({
            headerName: el.name,
            field: el.key,
            width: this.columnDefs[i]?.width || 100
        }));
        this.setColumns();
        this.mountColumnsEditors();
    }

    mountColumnsEditors() {
        this.fieldsEditor = this.columnDefs.map((el, i) => ({
            key: `columnDefs[${i}].width`,
            label: `Coluna (${el.headerName})`,
            type: FieldEditorTypes.Range,
            max: 400
        }));
    }

    setColumns() {
        if (this.options.api) {
            this.options.api.setColumnDefs(this.columnDefs);
        }
        this.options.columnDefs = this.columnDefs;
    }

    mountRows(): void {
        if (this.options.api) {
            this.options.api.setRowData(this.data);
        }
    }
}
