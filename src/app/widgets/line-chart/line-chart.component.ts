import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WidgetComponent } from '../widget.interface';
import { LineChartDefault } from './line-chart.default';
import { DataSourceKey } from 'src/app/models/data-source.dtos';
import { ChartDataSets } from 'chart.js';
import { ChartAbstract } from '../chart.abstract';
import { Label } from 'ng2-charts/lib/base-chart.directive';
import { ExternalDataService } from '../../service/external-data.service';

@Component({
    selector: 'fb-line-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <fb-loading-widget [show]="isLoading"></fb-loading-widget>
        <div style="display: block; height: 100%">
            <canvas
                baseChart
                [plugins]="plugins"
                [options]="options"
                [datasets]="datasets"
                [labels]="labels"
                chartType="line"
            >
            </canvas>
        </div>
    `
})
export class LineChartComponent extends ChartAbstract implements WidgetComponent, OnChanges {
    @Input() public legoData;

    public dataSourceBindOptions = LineChartDefault.dataSourceBindOptions();
    public options = LineChartDefault.options();
    public fieldsEditor = LineChartDefault.fieldsEditor();
    public labels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public datasets: ChartDataSets[] = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
        { data: [70, 20, 10, 80, 40, 40, 20], label: 'Series B' },
        { data: [10, 20, 30, 35, 25, 20, 40], label: 'Series C' }
    ];

    constructor(protected cdr: ChangeDetectorRef, public externalDataService: ExternalDataService) {
        super(cdr);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.legoData) {
            this.legoData.data = this.getConfig();
        }
    }

    applyComponentData(): void {
        this.dataSourceSelectedKeys.forEach((value) => {
            if (value.key === 'labels') {
                this.mountLabels(value.data);
            }
            if (value.key === 'datasets') {
                this.mountDatasets(value.data);
            }
        });
        this.cdr.detectChanges();
    }

    mountLabels(labelKeys: DataSourceKey[]): void {
        const labelConfig = labelKeys.find(() => true);
        this.labels = labelConfig ? this.data.map((el) => el[labelConfig.key]) : [];
    }

    mountDatasets(labelKeys: DataSourceKey[]): void {
        const newData: ChartDataSets[] = [];
        labelKeys.forEach((config) => {
            newData.push({
                label: config.name,
                data: this.data.map((el) => el[config.key])
            });
        });
        this.datasets = newData;
    }
}
