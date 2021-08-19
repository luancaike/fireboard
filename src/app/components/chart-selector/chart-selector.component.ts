import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { ChartItemConfig, ChartTypes } from '../../models/charts.dtos';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounce } from '../../utils/effects';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { DataSource } from '../../models/data-source.dtos';

@Component({
    selector: 'fb-chart-selector',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './chart-selector.component.html',
    styleUrls: ['./chart-selector.component.scss']
})
export class ChartSelectorComponent {
    @ViewChild('modalChartSelect') modalChartSelect: ElementRef;
    @ViewChild('modalTypeChartSelect') modalTypeChartSelect: ElementRef;
    @Input() charts: ChartItemConfig[] = [];
    @Input() dataSources: DataSource[] = [];
    @Output() selected = new EventEmitter<ChartItemConfig>();
    @Output() editable = new EventEmitter<ChartItemConfig>();

    public modelChart: ChartItemConfig;
    public chartEditorModal = false;
    public modalRef: NgbModalRef;
    public modalRefType: NgbModalRef;
    public filterText = '';
    public chartsFilter: ChartItemConfig[] = [];
    public chartsTypesFilter = [
        {
            type: 'bar-chart',
            label: 'Barra'
        },
        {
            type: 'line-chart',
            label: 'Linha'
        },
        {
            type: 'pie-chart',
            label: 'Pizza'
        },
        {
            type: 'table',
            label: 'Tabela'
        }
    ];

    public get getItems() {
        return this.chartsFilter.length ? this.chartsFilter : this.charts;
    }

    constructor(private modalService: NgbModal, private cdr: ChangeDetectorRef, private zone: NgZone) {}

    selectChart(item: ChartItemConfig) {
        this.selected.emit(item);
        this.modalRef.close();
    }

    editChart(item: ChartItemConfig) {
        this.modelChart = item;
        this.chartEditorModal = true;
        this.modalRef.close();
    }

    newChart() {
        this.modelChart = { id: null, name: null, type: null, data: null };
        this.modalRef.close();
        this.modalRefType = this.modalService.open(this.modalTypeChartSelect, { centered: true });
    }

    selectType(type: ChartTypes) {
        this.modelChart.type = type;
        this.chartEditorModal = true;
        this.modalRefType.close();
    }

    show(): void {
        this.zone.run(() => {
            this.modalRef = this.modalService.open(this.modalChartSelect, { centered: true });
        });
    }

    @debounce()
    filterTextAction() {
        this.chartsFilter = this.charts.filter(
            (item) =>
                !this.filterText ||
                !this.filterText.length ||
                !!~item.name.toUpperCase().indexOf(this.filterText.toUpperCase())
        );
        this.cdr.detectChanges();
    }
}
