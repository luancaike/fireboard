import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { WidgetAbstract, WidgetConfig } from '../../widgets/widget.abstract';
import { CraftableComponent } from 'ng-craftable';
import { DataSource } from '../../models/data-source.dtos';
import { ChartItemConfig } from '../../models/charts.dtos';
import { DataSourceSelectorComponent } from '../data-source-selector/data-source-selector.component';
import { StyleEditorComponent } from '../style-editor/style-editor.component';

@Component({
    selector: 'fb-chart-editor',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './chart-editor.component.html',
    styleUrls: ['./chart-editor.component.scss']
})
export class ChartEditorComponent {
    @ViewChildren('chart') widgetsList: QueryList<WidgetAbstract>;
    @ViewChild('datasourceSelector') datasourceSelector: DataSourceSelectorComponent;
    @ViewChild('styleEditorWidget') styleEditorWidget: StyleEditorComponent;

    @Output() save = new EventEmitter<ChartItemConfig>();
    @Output() showPanelChange = new EventEmitter();
    @Input() craftable: CraftableComponent;
    @Input() filtersList: QueryList<WidgetAbstract>;
    @Input() dataSources: DataSource[] = [];
    @Input() modelChart: ChartItemConfig;

    constructor(protected cdr: ChangeDetectorRef) {}

    get getChartSelect() {
        return this.widgetsList?.first;
    }

    get isValid(): boolean {
        return this.modelChart && this.modelChart.name && this.modelChart.data;
    }

    @Input() set showPanel(value: boolean) {
        this.showPanelChange.emit(value);
        this._showPanel = value;
    }

    get showPanel(): boolean {
        return this._showPanel;
    }

    private _showPanel = false;

    updateLegoOptions(legoOptions: WidgetConfig): void {
        this.modelChart.data = this.getChartSelect.getConfig();
        this.getChartSelect?.setConfig(legoOptions);
    }

    _save() {
        console.log(this.modelChart);
        this.save.emit({ ...this.modelChart });
    }
}
