import { ChangeDetectionStrategy, Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CraftableComponent } from 'ng-craftable';
import { DatasourceSelectorComponent } from './components/datasource-selector/datasource-selector.component';
import { WidgetsBase } from './widgets/widgets.base';
import { BarChartComponent } from './widgets/bar-chart/bar-chart.component';

@Component({
    selector: 'fb-dashboard-builder',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./fireboard.component.scss'],
    templateUrl: './fireboard.component.html'
})
export class FireboardComponent {
    @ViewChildren('chart') widgetsList: QueryList<WidgetsBase>;
    @ViewChild('craftable') craftable: CraftableComponent;
    @ViewChild('datasourceSelector') datasourceSelector: DatasourceSelectorComponent;
    showLegoOptionsEditor = false;
    dataSources = [
        { name: 'teste1', id: 1 },
        { name: 'teste2', id: 2 }
    ];
    visualizationMode = false;

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

    showGeneralOptionsEditor(): void {}

    updateLegoDataSource(legoConfig) {
        const lego = this.craftable.getSelectedLegos()[0];
        if (lego) {
            const component = this.widgetsList.find((el) => el.legoData.key === lego.key);
            component.setConfig(legoConfig);
        }
    }

    showSelectedLegoOptionsEditor(): void {
        const lego = this.craftable.getSelectedLegos()[0];
        if (lego) {
            this.showLegoOptionsEditor = true;
            this.datasourceSelector.editLego(lego.data);
        }
    }
}
