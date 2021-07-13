import * as Chart from 'chart.js';

export const PresetColors = ['#4285F4', '#F44242', '#42F480'];

export function GetColorChart(color: string, darken = 0): string {
    return Chart.helpers.color(color).darken(darken).rgbString();
}
