import { WidgetAbstract, WidgetOptions } from './widget.abstract';
import { PresetColors } from '../utils/chart';
import * as Chart from 'chart.js';
import { ChartDataSets, ChartType } from 'chart.js';
import 'chartjs-plugin-datalabels';
import 'chartjs-plugin-colorschemes';
import { ElementRef } from '@angular/core';

export abstract class ChartAbstract extends WidgetAbstract {
    abstract canvas: ElementRef;
    abstract type: ChartType;
    public labels: string[] = [];
    public datasets: ChartDataSets[] = [];
    public chart: Chart;

    mountChart() {
        if (this.chart) {
            this.chart.destroy();
        }
        this.chart = new Chart(this.canvas.nativeElement, {
            type: this.type,
            data: {
                labels: this.labels,
                datasets: this.datasets
            },
            options: this.options
        });
    }

    setOptions(options: WidgetOptions): void {
        const scheme = options?.plugins?.colorschemes?.scheme || PresetColors();
        super.setOptions({
            ...{
                plugins: {
                    colorschemes: {
                        override: true,
                        scheme
                    },
                    ...options.plugins
                },
                animation: {
                    duration: 0
                },
                hover: {
                    animationDuration: 0
                },
                responsiveAnimationDuration: 0,
                ...options
            }
        });
        this.mountChart();
    }
}
