import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
        this.modalRef = this.modalService.open(this.modalChartSelect, { centered: true, backdrop: 'static' });
    }

    filterTextAction() {
        this.isLoading = true;
        this.getTableColumns();
    }

    @debounce(500)
    getTableColumns() {
        if (this.filterText && this.filterText.length) {
            this.dataService.searchTable(this.filterText).subscribe(
                ({ data }) => {
                    this.dataColumns = data.map((el) => ({
                        name: el.columnName,
                        type: el.dataType,
                        key: el.columnName
                    }));
                },
                () => null,
                () => (this.isLoading = false)
            );
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
        this.dataService.addTableSource(model).subscribe(() => {
            this.modalRef.close();
        });
    }

    removeItem(item: any) {
        this.dataColumns.splice(this.dataColumns.indexOf(item), 1);
    }
}
