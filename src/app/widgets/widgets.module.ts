import { NgModule } from '@angular/core';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { PieChartComponent } from './pie-chart/pie-chart.component';

@NgModule({
    imports: [ChartsModule, CommonModule],
    declarations: [BarChartComponent, PieChartComponent],
    exports: [BarChartComponent, PieChartComponent]
})
export class WidgetsModule {}
