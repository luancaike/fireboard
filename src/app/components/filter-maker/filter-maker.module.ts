import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../icons/icons.module';
import { FilterMakerComponent } from './filter-maker.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectColumnModule } from '../select-column/select-column.module';

@NgModule({
    imports: [CommonModule, IconsModule, FormsModule, NgSelectModule, SelectColumnModule],
    declarations: [FilterMakerComponent],
    exports: [FilterMakerComponent]
})
export class FilterMakerModule {}
