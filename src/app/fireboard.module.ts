import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { FireboardComponent } from './fireboard.component';
import { CraftableModule } from 'ng-craftable';
import { IconsModule } from './icons/icons.module';
import { WidgetsModule } from './widgets/widgets.module';
import { DataSourceSelectorComponent } from './components/data-source-selector/data-source-selector.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StyleEditorComponent } from './components/style-editor/style-editor.component';
import { ToolbarMenuComponent } from './components/toolbar-menu/toolbar-menu.component';
import { ModalPanelComponent } from './components/modal-panel/modal-panel.component';
import { FilterMakerComponent } from './components/filter-maker/filter-maker.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilterSelectorComponent } from './components/filter-selector/filter-selector.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { LoadingBarService } from './service/loading-bar.service';
import { AgGridModule } from 'ag-grid-angular';
import { TableComponent } from './widgets/table/table.component';
import { DateFilterComponent } from './widgets/date-filter/date-filter.component';
import { InputSelectComponent } from './widgets/input-select/input-select.component';
import { InputTextComponent } from './widgets/input-text/input-text.component';
import { CardSelectComponent } from './widgets/card-select/card-select.component';
import { SqlBuilderModule } from './components/sql-builder/sql-builder.module';
import { PopoverModule } from './components/popover/popover.module';
import { SelectColumnModule } from './components/select-column/select-column.module';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        WidgetsModule,
        IconsModule,
        CraftableModule,
        DragDropModule,
        NgbModule,
        PopoverModule,
        SqlBuilderModule,
        AgGridModule.withComponents([]),
        SelectColumnModule,
        NgSelectModule
    ],
    providers: [LoadingBarService],
    declarations: [
        FireboardComponent,
        DataSourceSelectorComponent,
        StyleEditorComponent,
        ToolbarMenuComponent,
        ModalPanelComponent,
        FilterMakerComponent,
        FilterSelectorComponent,
        LoadingBarComponent,
        TableComponent,
        DateFilterComponent,
        InputSelectComponent,
        InputTextComponent,
        CardSelectComponent
    ],
    bootstrap: [FireboardComponent]
})
export class FireboardModule {}
