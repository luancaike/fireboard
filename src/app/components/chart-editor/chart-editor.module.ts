import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartEditorComponent } from './chart-editor.component';
import { IconsModule } from '../../icons/icons.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataSourceSelectorModule } from '../data-source-selector/data-source-selector.module';
import { StyleEditorModule } from '../style-editor/style-editor.module';
import { WidgetsModule } from '../../widgets/widgets.module';

@NgModule({
    imports: [
        CommonModule,
        IconsModule,
        FormsModule,
        NgbModule,
        DataSourceSelectorModule,
        StyleEditorModule,
        WidgetsModule
    ],
    declarations: [ChartEditorComponent],
    exports: [ChartEditorComponent]
})
export class ChartEditorModule {}
