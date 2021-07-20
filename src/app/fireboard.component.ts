import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { CraftableComponent } from 'ng-craftable';
import { DataSourceSelectorComponent } from './components/data-source-selector/data-source-selector.component';
import { WidgetAbstract, WidgetConfig, WidgetOptions } from './widgets/widget.abstract';
import { DataSource } from './models/data-source.dtos';
import { DataSourceMockList } from './models/mocks';
import { StyleEditorComponent } from './components/style-editor/style-editor.component';
import { ExternalDataService } from './service/external-data.service';
import { debounce } from './utils/effects';

@Component({
    selector: 'fb-dashboard-builder',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./fireboard.component.scss'],
    templateUrl: './fireboard.component.html'
})
export class FireboardComponent {
    @ViewChildren('chart') widgetsList: QueryList<WidgetAbstract>;
    @ViewChild('craftable') craftable: CraftableComponent;
    @ViewChild('datasourceSelector') datasourceSelector: DataSourceSelectorComponent;
    @ViewChild('styleEditorComponent') styleEditorComponent: StyleEditorComponent;
    nameBoard = 'Nome do Dashboard';
    isLoading = false;
    showLegoOptionsEditor = false;
    dataSources: DataSource[] = DataSourceMockList;
    visualizationMode = false;

    constructor(private cdr: ChangeDetectorRef, public externalDataService: ExternalDataService) {}

    drawNewLego(data?: any): void {
        const activeElement = document.activeElement as HTMLButtonElement;
        activeElement.blur && activeElement.blur();
        this.craftable.drawNewLego(data);
    }

    selectionChange(data: string[]): void {
        this.showLegoOptionsEditor = false;
        if (data.length === 1) {
            this.showSelectedLegoOptionsEditor();
        } else {
            this.showGeneralOptionsEditor();
        }
    }

    showGeneralOptionsEditor(): void {
        // Implement
    }

    updateLegoDataSource(legoConfig: WidgetConfig): void {
        const lego = this.craftable.getSelectedLegos().find(() => true);
        if (lego) {
            const component = this.widgetsList.find((el) => el.legoData.key === lego.key);
            component.setConfig(legoConfig);
        }
    }

    updateLegoOptions(legoOptions: WidgetOptions): void {
        const lego = this.craftable.getSelectedLegos().find(() => true);
        if (lego) {
            const component = this.widgetsList.find((el) => el.legoData.key === lego.key);
            component.setOptions(legoOptions);
        }
    }

    exportData() {
        const dataSave = this.craftable.legoData.map((lego) => ({
            ...lego,
            data: this.widgetsList.find((w) => w.legoData.key === lego.key).getConfig()
        }));
        localStorage.setItem('localData', JSON.stringify(dataSave));
        console.log(dataSave);
    }

    @debounce()
    importData() {
        const dataImport = JSON.parse(localStorage.getItem('localData'));
        this.craftable.setLegoData(dataImport);
        this.cdr.detectChanges();
    }

    toggleVisualizationMode(): void {
        this.visualizationMode = !this.visualizationMode;
        setTimeout(() => this.craftable.setScaleByScreen());
    }

    showSelectedLegoOptionsEditor(): void {
        this.isLoading = true;
        setTimeout(() => {
            const lego = this.craftable.getSelectedLegos().find(() => true);
            if (lego) {
                const component = this.widgetsList.find((el) => el.legoData.key === lego.key);
                if (component) {
                    this.isLoading = false;
                    this.showLegoOptionsEditor = true;
                    this.datasourceSelector.editLego(component.getConfig());
                    this.styleEditorComponent.fieldsEditor = component.fieldsEditor;
                    this.styleEditorComponent.editLego(component.getOptions());
                    this.cdr.detectChanges();
                } else {
                    this.showSelectedLegoOptionsEditor();
                }
            }
        }, 300);
    }
}
