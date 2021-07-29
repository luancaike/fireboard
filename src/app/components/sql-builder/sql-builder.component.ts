import { Component, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { PopoverComponent } from '../popover/popover.component';

@Component({
    selector: 'fb-sql-builder',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './sql-builder.component.html',
    styleUrls: ['./sql-builder.component.scss']
})
export class SqlBuilderComponent {
    @ViewChildren(PopoverComponent) popovers: QueryList<PopoverComponent>;
    public tables = [
        {
            id: 1,
            name: 'teste 1'
        },
        {
            id: 2,
            name: 'teste 2'
        },
        {
            id: 3,
            name: 'teste 3'
        },
        {
            id: 4,
            name: 'teste 4'
        }
    ];

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
