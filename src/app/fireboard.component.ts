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
import { FireboardDataService } from './service/fireboard-data.service';
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
    @ViewChildren('chart')
    public widgetsList: QueryList<WidgetAbstract>;
    @ViewChildren('filter')
    public filtersList: QueryList<WidgetAbstract>;
    @ViewChild('craftable')
    public craftable: CraftableComponent;
    @ViewChild('datasourceSelector')
    public datasourceSelector: DataSourceSelectorComponent;
    @ViewChild('optionsConfiguration')
    public optionsConfiguration: DataSourceSelectorComponent;
    @ViewChild('styleEditorWidget')
    public styleEditorWidget: StyleEditorComponent;
    @ViewChild('styleEditorFilter')
    public styleEditorFilter: StyleEditorComponent;

    public pages: DashboardPage[] = [];
    public pageSelected = 0;
    public nameBoard = 'Nome do Dashboard';
    public isLoading = false;
    public showLegoOptionsEditor = false;
    public dataSources: DataSource[] = DataSourceMockList;
    public visualizationMode = false;
    public showTabsWidget = null;

    constructor(private cdr: ChangeDetectorRef, public fireboardDataService: FireboardDataService) {}

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
        this.saveSelectedPage();
        this.selectPage(0);
    }

    selectPage(pageIndex: number): void {
        this.isLoading = true;
        this.blurDropdown();
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
            this.showTabsWidget = null;
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
        this.saveSelectedPage();
        localStorage.setItem('localData', JSON.stringify(this.pages));
        console.log(this.pages);
    }

    @debounce()
    importData() {
        this.pages = JSON.parse(localStorage.getItem('localData'));
        this.selectPage(0);
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
                const filter = this.filtersList.find((el) => el.legoData.key === lego.key);
                if (component) {
                    this.isLoading = false;
                    this.showLegoOptionsEditor = true;
                    this.datasourceSelector.editLego(component?.getConfig());
                    this.styleEditorWidget.fieldsEditor = component.fieldsEditor;
                    this.styleEditorWidget.editLego(component?.getOptions());
                    this.showTabsWidget = true;
                } else if (filter) {
                    this.isLoading = false;
                    this.showLegoOptionsEditor = true;
                    this.datasourceSelector.editLego(filter?.getConfig());
                    this.styleEditorFilter.fieldsEditor = filter.fieldsEditor;
                    this.styleEditorFilter.editLego(filter?.getOptions());
                    this.showTabsWidget = false;
                } else {
                    this.showSelectedLegoOptionsEditor();
                }
                this.detectChanges();
            }
        }, 300);
    }

    @debounce()
    detectChanges() {
        this.cdr.detectChanges();
    }
}
