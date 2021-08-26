import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataSourceSelectorComponent } from './data-source-selector.component';
import { IconsModule } from '../../icons/icons.module';
import { ModalPanelModule } from '../modal-panel/modal-panel.module';
import { FilterSelectorModule } from '../filter-selector/filter-selector.module';
import { SelectColumnModule } from '../select-column/select-column.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IconsModule,
        ModalPanelModule,
        FilterSelectorModule,
        SelectColumnModule,
        NgSelectModule
    ],
    declarations: [DataSourceSelectorComponent],
    exports: [DataSourceSelectorComponent]
})
export class DataSourceSelectorModule {}
