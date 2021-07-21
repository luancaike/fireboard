import {
    AfterViewInit,
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
import { LegoConfig } from 'ng-craftable/lib/model';

type DashboardPage = {
    name: string;
    data: LegoConfig[];
};

@Component({
    selector: 'fb-dashboard-builder',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./fireboard.component.scss'],
    templateUrl: './fireboard.component.html'
})
export class FireboardComponent implements AfterViewInit {
    @ViewChildren('chart') widgetsList: QueryList<WidgetAbstract>;
    @ViewChild('craftable') craftable: CraftableComponent;
    @ViewChild('datasourceSelector') datasourceSelector: DataSourceSelectorComponent;
    @ViewChild('styleEditorComponent') styleEditorComponent: StyleEditorComponent;
    pages: DashboardPage[] = [];
    pageSelected = 0;
    nameBoard = 'Nome do Dashboard';
    isLoading = false;
    showLegoOptionsEditor = false;
    dataSources: DataSource[] = DataSourceMockList;
    visualizationMode = false;

    constructor(private cdr: ChangeDetectorRef, public externalDataService: ExternalDataService) {}

    ngAfterViewInit(): void {
        this.addPage();
    }

    addPage(): void {
        this.isLoading = true;
        this.blurDropdown();
        this.saveSelectedPage();
        this.pages.push({
            data: [],
            name: `Página ${this.pages.length + 1}`
        });
        this.setCraftableData([]);
        this.pageSelected = this.pages.length - 1;
        setTimeout(() => {
            this.isLoading = false;
            this.detectChanges();
        });
    }

    deletePage(event: MouseEvent, pageIndex: number): void {
        event.preventDefault();
        this.pages.splice(pageIndex, 1);
        this.selectPage(0);
    }

    selectPage(pageIndex: number): void {
        this.isLoading = true;
        this.blurDropdown();
        this.saveSelectedPage();
        if (this.pages[pageIndex]) {
            this.pageSelected = pageIndex;
            this.setCraftableData(this.pages[pageIndex].data);
        }
        setTimeout(() => {
            this.isLoading = false;
            this.detectChanges();
        });
    }

    saveSelectedPage(): void {
        if (this.pages[this.pageSelected]) {
            this.pages[this.pageSelected].data = this.getCraftableData();
        }
    }

    drawNewLego(data?: any): void {
        this.blurDropdown();
        this.craftable.drawNewLego(data);
    }

    blurDropdown(): void {
        const activeElement = document.activeElement as HTMLButtonElement;
        activeElement.blur && activeElement.blur();
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

    getCraftableData(): LegoConfig[] {
        return this.craftable.legoData.map((lego) => ({
            ...lego,
            data: this.widgetsList.find((w) => w.legoData.key === lego.key)?.getConfig()
        }));
    }

    setCraftableData(data: LegoConfig[]): void {
        this.craftable.setLegoData(data);
        (this.craftable as any).detectChanges();
        this.detectChanges();
    }

    exportData() {
        const dataSave = this.getCraftableData();
        localStorage.setItem('localData', JSON.stringify(dataSave));
        console.log(dataSave);
    }

    @debounce()
    importData() {
        const dataImport = JSON.parse(localStorage.getItem('localData'));
        this.setCraftableData(dataImport);
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
                    this.datasourceSelector.editLego(component?.getConfig());
                    this.styleEditorComponent.fieldsEditor = component.fieldsEditor;
                    this.styleEditorComponent.editLego(component.getOptions());
                    this.detectChanges();
                } else {
                    this.showSelectedLegoOptionsEditor();
                }
            }
        }, 300);
    }

    @debounce()
    detectChanges() {
        this.cdr.detectChanges();
    }
}
