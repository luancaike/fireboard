import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WidgetComponent } from '../widget.interface';
import { PieChartDefault } from './pie-chart.default';
import { DataSourceKey } from 'src/app/models/data-source.dtos';
import { ChartDataSets } from 'chart.js';
import { ChartAbstract } from '../chart.abstract';
import { Label } from 'ng2-charts/lib/base-chart.directive';
import { PresetColors } from '../../utils/chart';

@Component({
    selector: 'fb-pie-chart',
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
                chartType="pie"
            >
            </canvas>
        </div>
    `
})
export class PieChartComponent extends ChartAbstract implements WidgetComponent, OnChanges {
    @Input() public legoData;
    @Input() public dataGetter;

    public dataSourceBindOptions = PieChartDefault.dataSourceBindOptions();
    public options = PieChartDefault.options();
    public fieldsEditor = PieChartDefault.fieldsEditor();
    public labels: Label[] = ['Red', 'Blue', 'Yellow'];
    public colors = PresetColors;
    public datasets: ChartDataSets[] = [
        {
            label: 'My First Dataset',
            data: [300, 50, 100],
            borderColor: ['rgb(255,255,255)', 'rgb(255,255,255)', 'rgb(255,255,255)'],
            backgroundColor: ['rgb(66,133,244)', 'rgb(244,66,66)', 'rgb(66,244,128)']
        }
    ];

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
