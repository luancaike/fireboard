import { Component, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { PopoverComponent } from '../popover/popover.component';
import { DataSourceMockList } from '../../models/mocks';

@Component({
    selector: 'fb-sql-builder',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './sql-builder.component.html',
    styleUrls: ['./sql-builder.component.scss']
})
export class SqlBuilderComponent {
    @ViewChildren(PopoverComponent) popovers: QueryList<PopoverComponent>;
    public tables = DataSourceMockList;

    model: any = {
        table: null
    };

    closeAllPopovers(): void {
        this.popovers.forEach((popover) => popover.hide());
    }

    selectTable(table: any): void {
        this.model.table = { ...table };
        this.closeAllPopovers();
    }
}
