import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { ChartItemConfig } from '../../models/charts.dtos';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounce } from '../../utils/effects';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

@Component({
    selector: 'fb-chart-selector',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './chart-selector.component.html',
    styleUrls: ['./chart-selector.component.scss']
})
export class ChartSelectorComponent {
    @ViewChild('modalChartSelect') modalChartSelect: ElementRef;
    @Input() charts: ChartItemConfig[] = [];
    @Output() selected = new EventEmitter<ChartItemConfig>();
    @Output() editable = new EventEmitter<ChartItemConfig>();

    public modalRef: NgbModalRef;
    public filterText = '';
    public chartsFilter: ChartItemConfig[] = [];

    public get getItems() {
        return this.chartsFilter.length ? this.chartsFilter : this.charts;
    }

    constructor(private modalService: NgbModal, private cdr: ChangeDetectorRef) {}

    _selectChart(item: ChartItemConfig) {
        this.selected.emit(item);
        this.modalRef.close();
    }

    _editChart(item: ChartItemConfig) {
        this.editable.emit(item);
        this.modalRef.close();
    }

    show(): void {
        this.modalRef = this.modalService.open(this.modalChartSelect, { centered: true });
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
