import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { CraftableComponent } from 'ng-craftable';
import { DataSourceSelectorComponent } from './components/data-source-selector/data-source-selector.component';
import { WidgetAbstract, WidgetConfig, WidgetOptions } from './widgets/widget.abstract';
import { DataSource, DataSourceKey } from './models/data-source.dtos';
import { ChartsMockList, DataSourceMockList } from './models/mocks';
import { StyleEditorComponent } from './components/style-editor/style-editor.component';
import { FireboardDataService } from './service/fireboard-data.service';
import { debounce } from './utils/effects';
import { LegoConfig } from 'ng-craftable/lib/model';
import { FilterBindKey, FilterHandlerDto } from './models/filter.dtos';
import { ChartItemConfig } from './models/charts.dtos';
import { ChartSelectorComponent } from './components/chart-selector/chart-selector.component';

type DashboardPage = {
    name: string;
    filters: FilterBindKey[];
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
    @ViewChildren('filter') filtersList: QueryList<WidgetAbstract>;

    @ViewChild('craftable') craftable: CraftableComponent;
    @ViewChild('modalChartSelect') modalChartSelect: ElementRef;
    @ViewChild('datasourceSelector') datasourceSelector: DataSourceSelectorComponent;
    @ViewChild('optionsConfiguration') optionsConfiguration: DataSourceSelectorComponent;
    @ViewChild('styleEditorWidget') styleEditorWidget: StyleEditorComponent;
    @ViewChild('chartSelector') chartSelector: ChartSelectorComponent;
    @ViewChild('styleEditorFilter') styleEditorFilter: StyleEditorComponent;

    public pages: DashboardPage[] = [];
    public pageSelected = 0;
    public nameBoard = 'Nome do Dashboard';
    public isLoading = false;
    public showLegoOptionsEditor = false;
    public dataSources: DataSource[] = DataSourceMockList;
    public chartsList: ChartItemConfig[] = ChartsMockList;
    public selectedFilter: WidgetAbstract;
    public visualizationMode = false;
    public enableDrag = true;
    public enableResize = true;
    public enableSelect = true;
    public showTabsWidget = false;
    public filterModal = false;
    public showFilterEditor = false;
    public enableFilterEditor = false;
    public chartEditorModal = false;

    constructor(private cdr: ChangeDetectorRef, public fireboardDataService: FireboardDataService) {
        this.fireboardDataService.filterEventEmitter.subscribe((data) => this.handlerFilter(data));
    }

    ngAfterViewInit(): void {
        this.addPage();
    }

    isControl(type: any) {
        return type === 'date-filter' || type === 'input-select' || type === 'input-text' || type === 'card-select';
    }

    enableEditFilter() {
        this.enableDrag = this.enableResize = this.enableSelect = false;
        this.enableFilterEditor = true;
        this.detectChanges();
        setTimeout(() => this.detectChanges(), 1000);
    }

    getWidgetComponent(key: string) {
        const component = this.widgetsList.find((el) => el.legoData.key === key);
        if (!component) {
            return null;
        }
        return component;
    }

    getFilterModel(lego: LegoConfig) {
        if (this.selectedFilter) {
            const model: FilterBindKey = {
                dataSource: lego.data.dataSource,
                keySource: null,
                type: this.selectedFilter.typeFilter,
                widgetKey: lego.key,
                filterKey: this.selectedFilter.legoData.key
            };
            const exists = this.fireboardDataService.getFilter(model);
            if (exists) {
                return exists.keySource;
            } else {
                this.fireboardDataService.addFilter(model);
                return model.keySource;
            }
        } else {
            return null;
        }
    }

    setFilterModel(lego: LegoConfig, keySource) {
        const model: FilterBindKey = {
            dataSource: lego.data.dataSource,
            keySource: keySource,
            type: this.selectedFilter.typeFilter,
            widgetKey: lego.key,
            filterKey: this.selectedFilter.legoData.key
        };
        this.fireboardDataService.addFilter(model);
        this.detectChanges();
    }

    getLegoSourceKeys(lego: LegoConfig): DataSourceKey[] {
        const component = this.getWidgetComponent(lego.key);
        if (!component) {
            return [];
        }
        const data = this.dataSources.find((el) => el.id === component.dataSource);
        if (!data) {
            return [];
        }
        return data.keys;
    }

    disableEditFilter() {
        this.enableDrag = this.enableResize = this.enableSelect = true;
        this.enableFilterEditor = false;
        this.detectChanges();
    }

    handlerFilter(filter: FilterHandlerDto) {
        this.widgetsList.forEach((widget) => {
            const model: FilterBindKey = {
                type: filter.type,
                widgetKey: widget.legoData.key,
                filterKey: filter.filterKey
            };
            const dataSource = this.fireboardDataService.getFilter(model);
            if (dataSource) {
                widget.updateDataAndApplyComponent();
            }
        });
    }

    addPage(): void {
        this.isLoading = true;
        this.blurDropdown();
        this.saveSelectedPage();
        this.pages.push({
            data: [],
            filters: [],
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
            this.fireboardDataService.filterBindKey = this.pages[pageIndex]?.filters || [];
        }
        setTimeout(() => {
            this.isLoading = false;
            this.detectChanges();
        });
    }

    saveSelectedPage(): void {
        if (this.pages[this.pageSelected]) {
            this.pages[this.pageSelected].data = this.getCraftableData();
            this.pages[this.pageSelected].filters = this.fireboardDataService.filterBindKey;
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

    updateLegoDataSource(legoConfig: WidgetConfig): void {
        const lego = this.craftable.getSelectedLegos().find(() => true);
        if (lego) {
            const allLegos = [...this.filtersList, ...this.widgetsList];
            const component = allLegos.find((el) => el.legoData.key === lego.key);
            component.setConfig(legoConfig);
        }
    }

    updateLegoOptions(legoOptions: WidgetOptions): void {
        const lego = this.craftable.getSelectedLegos().find(() => true);
        if (lego) {
            const allLegos = [...this.filtersList, ...this.widgetsList];
            const component = allLegos.find((el) => el.legoData.key === lego.key);
            component.setOptions(legoOptions);
        }
    }

    getCraftableData(): LegoConfig[] {
        const allLegos = [...this.filtersList, ...this.widgetsList];
        return this.craftable.legoData.map((lego) => ({
            ...lego,
            data: allLegos.find((w) => w.legoData.key === lego.key)?.getConfig()
        }));
    }

    checkDrawLegos(data: LegoConfig[], ifTrue = () => null) {
        if (!data.length) {
            return;
        }
        const allLegos = [...this.filtersList, ...this.widgetsList];
        const result = data.every((el) => !!allLegos.find((al) => al.legoData.key === el.key));
        if (result) {
            ifTrue();
        } else {
            setTimeout(() => this.checkDrawLegos(data, ifTrue), 300);
        }
    }

    setCraftableData(data: LegoConfig[]): void {
        this.addCraftableLegos([]);
        const controls = data.filter((lego) => this.isControl((lego as any).type));
        const widgets = data.filter((lego) => !this.isControl((lego as any).type));
        const widgetsHandles = () => {
            widgets.forEach((lego) => this.addCraftableLego(lego));
        };

        controls.forEach((lego) => this.addCraftableLego(lego));
        this.checkDrawLegos(controls, widgetsHandles);
    }

    addCraftableLego(data: LegoConfig): void {
        this.craftable.addLego(data);
        (this.craftable as any).detectChanges();
        this.detectChanges();
    }

    addCraftableLegos(data: LegoConfig[]): void {
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
        this.disableEditFilter();
        this.visualizationMode = !this.visualizationMode;
        setTimeout(() => this.craftable.setScaleByScreen());
    }

    showSelectedLegoOptionsEditor(): void {
        this.isLoading = true;
        setTimeout(() => {
            const lego = this.craftable.getSelectedLegos().find(() => true);
            if (lego) {
                const allLegos = [...this.filtersList, ...this.widgetsList];
                const component = allLegos.find((el) => el.legoData.key === lego.key);
                if (component) {
                    this.isLoading = false;
                    this.showLegoOptionsEditor = true;
                    // this.datasourceSelector.editLego(component?.getConfig());
                    this.styleEditorWidget.fieldsEditor = component.fieldsEditor;
                    // this.styleEditorWidget.editLego(component?.getOptions());
                    this.showTabsWidget = true;
                } else {
                    this.showSelectedLegoOptionsEditor();
                }
                this.detectChanges();
            }
        }, 300);
    }

    selectedChart(item: ChartItemConfig) {
        this.drawNewLego(item);
    }

    editChart(item: ChartItemConfig) {
        this.chartEditorModal = true;
        console.log(item);
    }

    showChartSelect() {
        this.chartSelector.show();
    }

    @debounce()
    onSelectedLego(event: string[]) {
        this.selectedFilter = this.filtersList.find((el) => !!event.find((e) => e === el.legoData.key));
        this.showFilterEditor = !!this.selectedFilter;
        this.detectChanges();
    }

    @debounce(100)
    detectChanges() {
        this.cdr.detectChanges();
    }
}
