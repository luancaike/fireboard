import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WidgetComponent } from '../widget.interface';
import { BarChartDefault } from './bar-chart.default';
import { DataSourceKey } from 'src/app/models/data-source.dtos';
import { ChartDataSets } from 'chart.js';
import { ChartAbstract } from '../chart.abstract';

@Component({
    selector: 'fb-bar-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div *ngIf="!isLoading" style="display: block; height: 100%">
            <canvas
                baseChart
                [colors]="colors"
                [plugins]="plugins"
                [options]="options"
                [datasets]="datasets"
                [labels]="labels"
                chartType="bar"
            >
            </canvas>
        </div>
    `
})
export class BarChartComponent extends ChartAbstract implements WidgetComponent, OnChanges {
    @Input() public legoData;
    @Input() public dataGetter;

    public dataSourceBindOptions = BarChartDefault.dataSourceBindOptions();
    public options = BarChartDefault.options();
    public fieldsEditor = BarChartDefault.fieldsEditor();

    constructor(protected cdr: ChangeDetectorRef) {
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
