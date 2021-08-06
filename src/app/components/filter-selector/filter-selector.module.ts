import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterSelectorComponent } from './filter-selector.component';
import { ModalPanelModule } from '../modal-panel/modal-panel.module';
import { FilterMakerModule } from '../filter-maker/filter-maker.module';
import { IconsModule } from '../../icons/icons.module';

@NgModule({
    imports: [CommonModule, ModalPanelModule, FilterMakerModule, IconsModule],
    declarations: [FilterSelectorComponent],
    exports: [FilterSelectorComponent]
})
export class FilterSelectorModule {}
