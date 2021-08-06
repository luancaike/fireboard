import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataSourceSelectorComponent } from './data-source-selector.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IconsModule } from '../../icons/icons.module';
import { ModalPanelModule } from '../modal-panel/modal-panel.module';
import { FilterSelectorModule } from '../filter-selector/filter-selector.module';

@NgModule({
    imports: [CommonModule, FormsModule, DragDropModule, IconsModule, ModalPanelModule, FilterSelectorModule],
    declarations: [DataSourceSelectorComponent],
    exports: [DataSourceSelectorComponent]
})
export class DataSourceSelectorModule {}
