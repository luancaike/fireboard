import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    ViewChild
} from '@angular/core';
import { WidgetComponent } from '../widget.interface';
import { LineChartDefault } from './line-chart.default';
import { DataSourceKey } from 'src/app/models/data-source.dtos';
import { ChartDataSets, ChartType } from 'chart.js';
import { ChartAbstract } from '../chart.abstract';
import { FireboardDataService } from '../../service/fireboard-data.service';

@Component({
    selector: 'fb-line-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <fb-loading-widget [show]="isLoading"></fb-loading-widget>
        <div style="display: block; height: 100%">
            <canvas #canvas></canvas>
        </div>
    `
})
export class LineChartComponent extends ChartAbstract implements WidgetComponent, AfterViewInit {
    @ViewChild('canvas', { read: ElementRef }) canvas: ElementRef;
    @Input() public legoData;

    public dataSourceBindOptions = LineChartDefault.dataSourceBindOptions();
    public options = LineChartDefault.options();
    public fieldsEditor = LineChartDefault.fieldsEditor();
    public type: ChartType = 'line';
    public labels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public datasets: ChartDataSets[] = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
        { data: [70, 20, 10, 80, 40, 40, 20], label: 'Series B' },
        { data: [10, 20, 30, 35, 25, 20, 40], label: 'Series C' }
    ];

    constructor(protected cdr: ChangeDetectorRef, public fireboardDataService: FireboardDataService) {
        super(cdr);
    }

    ngAfterViewInit() {
        if (this.legoData.data) {
            this.setConfig(this.legoData.data);
        } else {
            this.legoData.data = this.getOptions();
        }
        this.mountChart();
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
        this.mountChart();
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
