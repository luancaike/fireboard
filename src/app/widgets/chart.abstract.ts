import { WidgetAbstract, WidgetOptions } from './widget.abstract';
import { Label, PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts/lib/base-chart.directive';
import { PresetColors } from '../utils/chart';
import { ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as pluginColorschemes from 'chartjs-plugin-colorschemes';

export abstract class ChartAbstract extends WidgetAbstract {
    public plugins: PluginServiceGlobalRegistrationAndOptions[] = [
        pluginDataLabels as PluginServiceGlobalRegistrationAndOptions,
        pluginColorschemes as PluginServiceGlobalRegistrationAndOptions
    ];
    public colors: string[] = PresetColors;
    public labels: Label[] = [];
    public datasets: ChartDataSets[] = [];

    setOptions(options: WidgetOptions): void {
        super.setOptions({
            ...{
                ...options,
                plugins: {
                    ...options.plugins,
                    colorschemes: {
                        ...options.colorschemes,
                        override: true,
                        scheme: this.colors
                    }
                },
                animation: {
                    duration: 0
                },
                hover: {
                    animationDuration: 0
                },
                responsiveAnimationDuration: 0
            }
        });
    }
}
