import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableSourceComponent } from './table-source.component';
import { IconsModule } from '../../icons/icons.module';
import { FormsModule } from '@angular/forms';
import { ModalPanelModule } from '../modal-panel/modal-panel.module';
import { ChartEditorModule } from '../chart-editor/chart-editor.module';

@NgModule({
    imports: [CommonModule, IconsModule, FormsModule, ModalPanelModule, ChartEditorModule],
    declarations: [TableSourceComponent],
    exports: [TableSourceComponent]
})
export class TableSourceModule {}
