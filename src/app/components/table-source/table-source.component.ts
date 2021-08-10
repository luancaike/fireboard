import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataSource } from '../../models/data-source.dtos';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { FireboardDataService } from '../../service/fireboard-data.service';
import { debounce } from '../../utils/effects';

@Component({
    selector: 'fb-table-source',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './table-source.component.html',
    styleUrls: ['./table-source.component.scss']
})
export class TableSourceComponent {
    @ViewChild('modalChartSelect') modalChartSelect: ElementRef;
    @ViewChild('modalTypeChartSelect') modalTypeChartSelect: ElementRef;
    @Input() dataSources: DataSource[] = [];

    public filterText: string;
    public nameOrigin: string;
    public isLoading = false;
    public dataColumns = [];
    public modalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private cdr: ChangeDetectorRef,
        private dataService: FireboardDataService
    ) {}

    get isValid() {
        return this.nameOrigin && this.nameOrigin.length && this.dataColumns.length;
    }

    show(): void {
        this.modalRef = this.modalService.open(this.modalChartSelect, { centered: true });
    }

    filterTextAction() {
        this.isLoading = true;
        this.getTableColumns();
    }

    @debounce(500)
    getTableColumns() {
        if (this.filterText && this.filterText.length) {
            this.dataService.searchTable(this.filterText).then(({ data }) => {
                this.isLoading = false;
                this.dataColumns = data.map((el) => ({
                    name: el.columnName,
                    type: el.dataType,
                    key: el.columnName
                }));
            });
        } else {
            this.isLoading = false;
        }
    }

    save() {
        const model = {
            name: this.nameOrigin,
            tableName: this.filterText,
            columns: this.dataColumns
        };
        this.dataService.addTableSource(model).then(() => {
            this.modalRef.close();
        });
    }

    removeItem(item: any) {
        this.dataColumns.splice(this.dataColumns.indexOf(item), 1);
    }
}
