import * as Chart from 'chart.js';

export const PresetColors = ['#4285F4', '#F44242', '#42F480'];

export function GetColorChart(color: string, darken = 0): string {
    return Chart.helpers.color(color).darken(darken).rgbString();
}

// FFFFFF00
type ColorByDarkOptions = { darken?: string; lighten?: string };
export const ColorByDark = (hex: string, options: ColorByDarkOptions = {}): string => {
    const darken = options.darken || '#292d30';
    const lighten = options.lighten || '#ffffff';
    const checkRgb = (r, g, b) => {
        const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
        if (hsp > 127.5) {
            return darken;
        } else {
            return lighten;
        }
    };
    const color = Chart.helpers.color(hex);

    if (color.valid) {
        const { r, g, b } = color.rgb();
        return checkRgb(r, g, b);
    } else {
        return lighten;
    }
};
