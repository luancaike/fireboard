import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'fb-datasource-selector',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './datasource-selector.component.html',
    styleUrls: ['./datasource-selector.component.scss']
})
export class DatasourceSelectorComponent {
    @Input() dataSources: any[];
    @Output() changedDataSource = new EventEmitter();
    public dataSourceSelected = null;
    public legoConfig = null;

    constructor(protected cdr: ChangeDetectorRef) {}

    editLego(legoConfig: any): void {
        this.legoConfig = legoConfig;
        this.selectDataSource();
    }

    selectDataSource(): void {
        if (this.legoConfig.dataSource) {
            this.dataSourceSelected = this.legoConfig.dataSource;
        } else {
            this.dataSourceSelected = null;
        }
        this.cdr.detectChanges();
    }

    onChangedDataLego(): void {
        this.legoConfig.dataSource = this.dataSourceSelected;
        this.changedDataSource.emit(this.legoConfig);
    }
}
