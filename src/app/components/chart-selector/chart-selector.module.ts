import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartSelectorComponent } from './chart-selector.component';
import { IconsModule } from '../../icons/icons.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, IconsModule, FormsModule],
    declarations: [ChartSelectorComponent],
    exports: [ChartSelectorComponent]
})
export class ChartSelectorModule {}
