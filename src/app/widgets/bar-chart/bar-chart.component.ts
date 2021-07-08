import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WidgetsBase } from '../widgets.base';
import { WidgetComponent } from '../widgets.interface';
import { defaultOptions } from './bar-chart.default';
import { fieldsEditor } from './bar-chart.fields';

@Component({
    selector: 'fb-bar-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        {{ dataSource }}
        <div *ngIf="!isLoading" style="display: block; height: 100%">
            <canvas
                baseChart
                [colors]=""
                [plugins]="[]"
                [options]="options"
                [datasets]="[]"
                [labels]="[]"
                chartType="bar"
            >
            </canvas>
        </div>
    `
})
export class BarChartComponent extends WidgetsBase implements WidgetComponent, OnChanges {
    @Input() legoData;
    dataSourceBindOptions = [
        {
            label: 'Métricas',
            key: 'datasets',
            rules: {
                allowTypes: ['number', 'custom']
            }
        },
        {
            label: 'Rótulos',
            key: 'labels'
        }
    ];

    constructor(protected cdr: ChangeDetectorRef) {
        super();
    }

    options = defaultOptions;
    fieldsEditor = fieldsEditor;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.legoData) {
            this.legoData.data = this.getConfig();
        }
    }
}
