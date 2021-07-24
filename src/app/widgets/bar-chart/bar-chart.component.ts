import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild
} from '@angular/core';
import { WidgetComponent } from '../widget.interface';
import { BarChartDefault } from './bar-chart.default';
import { DataSourceKey } from 'src/app/models/data-source.dtos';
import { ChartDataSets, ChartType } from 'chart.js';
import { ChartAbstract } from '../chart.abstract';
import { FireboardDataService } from '../../service/fireboard-data.service';
import { ChartScrollableComponent } from '../../components/chart-scrollable/chart-scrollable.component';

@Component({
    selector: 'fb-bar-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <fb-loading-widget [show]="isLoading"></fb-loading-widget>
        <div style="display: block; height: 100%">
            <canvas #canvas></canvas>
        </div>
    `
})
export class BarChartComponent extends ChartAbstract implements WidgetComponent, AfterViewInit {
    @ViewChild('canvas') canvas: ElementRef;
    @ViewChild('scroll') scroll: ChartScrollableComponent;
    @Input() public legoData;
    @Output() public updateLegoData = new EventEmitter();

    public dataSourceBindOptions = BarChartDefault.dataSourceBindOptions();
    public options = BarChartDefault.options();
    public fieldsEditor = BarChartDefault.fieldsEditor();
    public type: ChartType = 'bar';
    public labels: string[] = ['Example 1', 'Example 2'];
    public datasets: ChartDataSets[] = [
        { data: [20, 15], label: 'Serie 1' },
        { data: [5, 30], label: 'Serie 2' },
        { data: [10, 20], label: 'Serie 3' }
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
