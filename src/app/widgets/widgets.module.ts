import { NgModule } from '@angular/core';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [ChartsModule, CommonModule],
    declarations: [BarChartComponent],
    exports: [BarChartComponent]
})
export class WidgetsModule {}
