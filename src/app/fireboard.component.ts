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
import { DataGetter, WidgetAbstract, WidgetConfig, WidgetOptions } from './widgets/widget.abstract';
import { DataSource } from './models/data-source.dtos';
import { DataSourceDataMockList, DataSourceMockList } from './models/mocks';
import { StyleEditorComponent } from './components/style-editor/style-editor.component';

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
    isLoading = false;
    showLegoOptionsEditor = false;
    dataSources: DataSource[] = DataSourceMockList;
    visualizationMode = false;
    dataGetter = (data: DataGetter): Promise<any[]> => {
        return new Promise((resolve) => {
            const result = DataSourceDataMockList.find((value) => value.id === data.id);
            resolve(result ? result.data : []);
        });
    };

    constructor(private cdr: ChangeDetectorRef) {}

    drawNewLego(): void {
        this.craftable.drawNewLego();
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
