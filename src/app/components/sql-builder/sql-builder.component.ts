import { Component, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { PopoverComponent } from '../popover/popover.component';
import { DataSourceMockList } from '../../models/mocks';
import { DataSource } from '../../models/data-source.dtos';
import { JoinType } from './sql-builder.model';

@Component({
    selector: 'fb-sql-builder',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './sql-builder.component.html',
    styleUrls: ['./sql-builder.component.scss']
})
export class SqlBuilderComponent {
    @ViewChildren(PopoverComponent) popovers: QueryList<PopoverComponent>;
    public tables: DataSource[] = DataSourceMockList;
    public model = {
        table: null,
        top: 0,
        select: [],
        group: [],
        order: [],
        forks: [
            {
                table: null,
                joinType: JoinType.Left,
                columnPrimary: null,
                columnSecondary: null
            }
        ]
    };

    get columnsOfModel() {
        const baseColumns = this.model?.table ? [this.model?.table] : [];
        const forkColumns =
            this.model?.forks?.reduce((acc, item) => {
                if (item?.table) {
                    acc.push(item?.table);
                }
                return acc;
            }, []) || [];
        return [...baseColumns, ...forkColumns];
    }

    public selectTable = (table: DataSource) => {
        this.model.table = table;
        this.closeAllPopovers();
    };
    public addSelect = (table: DataSource) => {
        this.model.select.push(table);
        this.closeAllPopovers();
    };
    public addGroup = (table: any) => {
        this.model.group.push(table);
        this.closeAllPopovers();
    };
    public addOrder = (table: any) => {
        table.direction = 'up';
        this.model.order.push(table);
        this.closeAllPopovers();
    };
    public removeItem = (data: any[], item: any) => {
        data.splice(data.indexOf(item), 1);
    };
    public toggleOrderDirection = (item: any) => {
        item.direction = item.direction === 'up' ? 'down' : 'up';
    };
    public selectForkKey = (indexOfFork: number, key: string) => (table: any) => {
        const fork = this.model.forks[indexOfFork];
        fork[key] = table;
        switch (key) {
            case 'table':
                fork.columnSecondary = null;
        }
        this.closeAllPopovers();
    };

    closeAllPopovers(): void {
        this.popovers.forEach((popover) => popover.hide());
    }

    openBox(element: HTMLElement) {
        if (!!~element.className.indexOf('collapsed')) {
            element.classList.toggle('collapsed');
        }
    }

    toggleForkType(index: number) {
        if (this.model.forks[index].joinType >= 3) {
            this.model.forks[index].joinType = 1;
        } else {
            ++this.model.forks[index].joinType;
        }
    }
}
