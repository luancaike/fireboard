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
import { SqlBuilderComponent } from '../sql-builder/sql-builder.component';

@Component({
    selector: 'fb-data-source',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './data-source.component.html',
    styleUrls: ['./data-source.component.scss']
})
export class DataSourceComponent {
    @ViewChild('modal') modalChartSelect: ElementRef;
    @ViewChild('sqlBuilder') sqlBuilder: SqlBuilderComponent;

    @Input() dataSources: DataSource[] = [];
    @Input() tableSources: DataSource[] = [];

    public dataSourcesFilter: DataSource[] = [];
    public filterText: string;
    public dataFormModal = false;
    public modalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private cdr: ChangeDetectorRef,
        private fireboardDataService: FireboardDataService
    ) {}

    public get getItems() {
        return this.dataSourcesFilter.length ? this.dataSourcesFilter : this.dataSources;
    }

    show(): void {
        this.modalRef = this.modalService.open(this.modalChartSelect, { centered: true, backdrop: 'static' });
    }

    filterTextAction() {
        this.dataSourcesFilter = this.dataSources.filter(
            (item) =>
                !this.filterText ||
                !this.filterText.length ||
                !!~item.name.toUpperCase().indexOf(this.filterText.toUpperCase())
        );
        this.cdr.detectChanges();
    }

    openSqlBuilderEditor() {
        this.modalRef.close();
        this.dataFormModal = true;
    }

    editDataSource(item) {
        this.openSqlBuilderEditor();
        this.sqlBuilder.editModel(item.id);
    }

    removeDataSource(item) {
        this.fireboardDataService.removeDataSource(item.id).subscribe(() => {
            this.dataSourcesFilter = [];
            const index = this.dataSources.indexOf(item);
            if (~index) {
                this.dataSources.splice(index, 1);
            }
        });
    }
}
