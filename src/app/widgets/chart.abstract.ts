import { WidgetAbstract, WidgetOptions } from './widget.abstract';
import { Label, PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts/lib/base-chart.directive';
import { Color } from 'ng2-charts';
import { GetColorChart, PresetColors } from '../utils/chart';
import { ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

export abstract class ChartAbstract extends WidgetAbstract {
    public plugins: PluginServiceGlobalRegistrationAndOptions[] = [
        pluginDataLabels as PluginServiceGlobalRegistrationAndOptions
    ];
    public colors: Color[] | string[] = PresetColors.map((color) => ({
        backgroundColor: GetColorChart(color),
        borderColor: GetColorChart(color)
    }));
    public labels: Label[] = [];
    public datasets: ChartDataSets[] = [];

    setOptions(options: WidgetOptions): void {
        super.setOptions({
            ...{
                animation: {
                    duration: 0
                },
                hover: {
                    animationDuration: 0
                },
                responsiveAnimationDuration: 0
            },
            ...options
        });
    }
}
