import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { FireboardComponent } from './fireboard.component';
import { CraftableModule } from 'ng-craftable';
import { IconsModule } from './icons/icons.module';
import { WidgetsModule } from './widgets/widgets.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToolbarMenuComponent } from './components/toolbar-menu/toolbar-menu.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { LoadingBarService } from './service/loading-bar.service';
import { AgGridModule } from 'ag-grid-angular';
import { DateFilterComponent } from './widgets/date-filter/date-filter.component';
import { InputSelectComponent } from './widgets/input-select/input-select.component';
import { InputTextComponent } from './widgets/input-text/input-text.component';
import { CardSelectComponent } from './widgets/card-select/card-select.component';
import { SqlBuilderModule } from './components/sql-builder/sql-builder.module';
import { PopoverModule } from './components/popover/popover.module';
import { SelectColumnModule } from './components/select-column/select-column.module';
import { ExpressionBuilderModule } from './components/expression-builder/expression-builder.module';
import { ChartSelectorModule } from './components/chart-selector/chart-selector.module';
import { ModalPanelModule } from './components/modal-panel/modal-panel.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './service/http.service';
import { TableSourceModule } from './components/table-source/table-source.module';

@NgModule({
    imports: [
        HttpClientModule,
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
        NgSelectModule,
        ExpressionBuilderModule,
        ChartSelectorModule,
        ModalPanelModule,
        TableSourceModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        LoadingBarService
    ],
    declarations: [
        FireboardComponent,
        ToolbarMenuComponent,
        LoadingBarComponent,
        DateFilterComponent,
        InputSelectComponent,
        InputTextComponent,
        CardSelectComponent
    ],
    bootstrap: [FireboardComponent]
})
export class FireboardModule {}
