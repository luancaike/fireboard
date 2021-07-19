import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { WidgetComponent } from '../widget.interface';
import { PieChartDefault } from './pie-chart.default';
import { DataSourceKey } from 'src/app/models/data-source.dtos';
import { ChartDataSets } from 'chart.js';
import { ChartAbstract } from '../chart.abstract';
import { Label } from 'ng2-charts/lib/base-chart.directive';
import { ExternalDataService } from '../../service/external-data.service';

@Component({
    selector: 'fb-pie-chart',
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
                chartType="pie"
            >
            </canvas>
        </div>
    `
})
export class PieChartComponent extends ChartAbstract implements WidgetComponent, AfterViewInit {
    @Input() public legoData;

    public dataSourceBindOptions = PieChartDefault.dataSourceBindOptions();
    public options = PieChartDefault.options();
    public fieldsEditor = PieChartDefault.fieldsEditor();
    public labels: Label[] = ['Red', 'Blue', 'Yellow'];
    public datasets: ChartDataSets[] = [
        {
            label: 'My First Dataset',
            data: [300, 50, 100]
        }
    ];

    constructor(protected cdr: ChangeDetectorRef, public externalDataService: ExternalDataService) {
        super(cdr);
    }

    ngAfterViewInit() {
        if (this.legoData.data) {
            this.setConfig(this.legoData.data);
        } else {
            this.legoData.data = this.getOptions();
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
