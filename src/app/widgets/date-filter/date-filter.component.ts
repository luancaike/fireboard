import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    NgZone,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { WidgetComponent } from '../widget.interface';
import { DateFilterDefault } from './date-filter.default';
import { FireboardDataService } from '../../service/fireboard-data.service';
import { FilterAbstract } from '../filter.abstract';
import { NgbDatepicker, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { WidgetOptions } from '../widget.abstract';
import { FilterQueryTypes } from '../../models/filter.dtos';

@Component({
    selector: 'fb-date-filter',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./date-filter.component.scss'],
    template: `
        <fb-loading-widget [show]="isLoading"></fb-loading-widget>
        <ng-template #content let-modal>
            <div
                class="card border-0"
                style="display: flex;
                                        justify-content: flex-start;
                                        height: 100%;"
            >
                <div class="card-header d-flex justify-content-between">
                    <h6 style="margin: .5rem;">
                        <fa-icon [fixedWidth]="true" [icon]="['far', 'calendar']" class="btn-icon"></fa-icon>
                        Intervalo de Data
                    </h6>
                    <button class="btn btn-sm btn-outline-dark close-modal" (click)="modal.close()">
                        <fa-icon icon="times"></fa-icon>
                    </button>
                </div>
                <div
                    class="card-body scroll-style"
                    style="max-height: calc(100% - 65px);overflow-x: hidden;overflow-y: auto; padding: 0"
                >
                    <div class="interval-selector">
                        <div class="picker">
                            <div class="title">De</div>
                            <ngb-datepicker #fromPicker [(ngModel)]="from"></ngb-datepicker>
                        </div>
                        <div class="picker">
                            <div class="title">Até</div>
                            <ngb-datepicker #toPicker [(ngModel)]="to"></ngb-datepicker>
                        </div>
                    </div>
                </div>
                <div class="card-footer text-muted d-flex justify-content-end">
                    <button
                        type="button"
                        class="btn btn-sm btn-apply"
                        [disabled]="!checkIsDateValid()"
                        (click)="applyFilter(modal)"
                    >
                        Aplicar
                    </button>
                </div>
            </div>
        </ng-template>
        <button class="date-picker" #datePicker (click)="open(content)">
            {{ fromPlaceholder }} - {{ toPlaceholder }}
            <fa-icon [fixedWidth]="true" [icon]="['far', 'calendar']" class="btn-icon-drop"></fa-icon>
        </button>
    `
})
export class DateFilterComponent extends FilterAbstract implements WidgetComponent, AfterViewInit {
    @ViewChild('datePicker') datePicker: ElementRef<HTMLButtonElement>;
    @ViewChild('fromPicker') fromPickerRef: NgbDatepicker;
    @ViewChild('toPicker') toPickerRef: NgbDatepicker;
    @Input() public legoData;

    public typeFilter = FilterQueryTypes.DateInterval;
    public filterKey = 'date-filter';
    public from: NgbDateStruct;
    public to: NgbDateStruct;
    public fromPlaceholder: string;
    public toPlaceholder: string;
    public dataSourceBindOptions = DateFilterDefault.dataSourceBindOptions();
    public options = DateFilterDefault.options();
    public fieldsEditor = DateFilterDefault.fieldsEditor();

    constructor(
        protected cdr: ChangeDetectorRef,
        public fireboardDataService: FireboardDataService,
        public zone: NgZone,
        private modalService: NgbModal
    ) {
        super(cdr);
    }

    setOptions(options: WidgetOptions) {
        const defaultOptions = DateFilterDefault.options();
        const newOptions = { ...defaultOptions, ...options };
        super.setOptions(newOptions);
        this.applyStyleOptions();
    }

    applyStyleOptions() {
        const style = this.datePicker.nativeElement.style;
        style.setProperty('--dp-border-color', this.options.borderColor);
        style.setProperty('--dp-font-color', this.options.fontColor);
        style.setProperty('--dp-font-size', `${this.options.fontSize}px`);
    }

    checkDateInRanger(dateString: string) {
        const dateToCompare = new Date(dateString);
        const fromCompare = this.modelToDate(this.from);
        const toCompare = this.modelToDate(this.to);
        return fromCompare <= dateToCompare && dateToCompare <= toCompare;
    }

    checkIsDateValid() {
        return this.modelToDate(this.from) < this.modelToDate(this.to);
    }

    open(content) {
        this.zone.run(() => {
            this.modalService.open(content, { centered: true });
            this.cdr.detectChanges();
        });
    }

    applyFilter(modal: NgbModalRef) {
        modal.close();
        this.setModelToPlaceholder();
        this.modelFilterUpdate(this.getFilterModel());
        this.modelUpdate();
    }

    getFilterModel() {
        return [this.modelToDate(this.from).toISOString(), this.modelToDate(this.to).toISOString()];
    }

    setModelToPlaceholder() {
        this.fromPlaceholder = this.modelToDate(this.from).toLocaleDateString('pt');
        this.toPlaceholder = this.modelToDate(this.to).toLocaleDateString('pt');
    }

    modelToDate(date: NgbDateStruct): Date {
        const newDate = new Date();
        newDate.setFullYear(
            date?.year ?? newDate.getFullYear(),
            date?.month - 1 ?? newDate.getMonth(),
            date?.day ?? newDate.getDay()
        );
        return newDate;
    }

    dateToModel(date: Date): NgbDateStruct {
        return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    }

    initDate() {
        const to = new Date();
        const from = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        this.from = this.dateToModel(from);
        this.to = this.dateToModel(to);
        this.setModelToPlaceholder();
        this.modelFilterUpdate(this.getFilterModel());
        this.modelUpdate();
        this.cdr.detectChanges();
    }

    ngAfterViewInit() {
        this.initDate();
        if (this.legoData.data) {
            this.setConfig(this.legoData.data);
        } else {
            this.legoData.data = this.getOptions();
        }
    }

    applyComponentData(): void {
        this.cdr.detectChanges();
    }
}
