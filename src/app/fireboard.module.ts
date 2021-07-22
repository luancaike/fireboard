import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { FireboardComponent } from './fireboard.component';
import { CraftableModule } from 'ng-craftable';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { IconsModule } from './icons/icons.module';
import { WidgetsModule } from './widgets/widgets.module';
import { DataSourceSelectorComponent } from './components/data-source-selector/data-source-selector.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StyleEditorComponent } from './components/style-editor/style-editor.component';
import { ToolbarMenuComponent } from './components/toolbar-menu/toolbar-menu.component';
import { ModalPanelComponent } from './components/modal-panel/modal-panel.component';
import { FilterMakerComponent } from './components/filter-maker/filter-maker.component';
import { SelectColumnComponent } from './components/select-column/select-column.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilterSelectorComponent } from './components/filter-selector/filter-selector.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { LoadingBarService } from './service/loading-bar.service';
import { AgGridModule } from 'ag-grid-angular';
import { TableComponent } from './widgets/table/table.component';
import { DateFilterComponent } from './widgets/date-filter/date-filter.component';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        WidgetsModule,
        IconsModule,
        CraftableModule,
        FontAwesomeModule,
        DragDropModule,
        NgbModule,
        NgSelectModule,
        AgGridModule.withComponents([])
    ],
    providers: [LoadingBarService],
    declarations: [
        FireboardComponent,
        DataSourceSelectorComponent,
        StyleEditorComponent,
        ToolbarMenuComponent,
        ModalPanelComponent,
        FilterMakerComponent,
        SelectColumnComponent,
        FilterSelectorComponent,
        LoadingBarComponent,
        TableComponent,
        DateFilterComponent
    ],
    bootstrap: [FireboardComponent]
})
export class FireboardModule {
    constructor(library: FaIconLibrary) {
        library.addIconPacks(far, fas, fab);
    }
}
