import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSourceComponent } from './data-source.component';
import { IconsModule } from '../../icons/icons.module';
import { FormsModule } from '@angular/forms';
import { ModalPanelModule } from '../modal-panel/modal-panel.module';
import { ChartEditorModule } from '../chart-editor/chart-editor.module';
import { SqlBuilderModule } from '../sql-builder/sql-builder.module';

@NgModule({
    imports: [CommonModule, IconsModule, FormsModule, ModalPanelModule, ChartEditorModule, SqlBuilderModule],
    declarations: [DataSourceComponent],
    exports: [DataSourceComponent]
})
export class DataSourceModule {}
