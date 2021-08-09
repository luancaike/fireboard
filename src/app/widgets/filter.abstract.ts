import { WidgetAbstract } from './widget.abstract';
import { DataSourceKey } from '../models/data-source.dtos';
import { FilterQueryTypes } from '../models/filter.dtos';

export abstract class FilterAbstract extends WidgetAbstract {
    isFilter = true;

    abstract typeFilter: FilterQueryTypes;
    abstract filterAction(data: any[]): any[];

    getKeySelected(): DataSourceKey {
        const sourceKey = this.dataSourceSelectedKeys.find(() => true);
        if (sourceKey) {
            return sourceKey.data.find(() => true);
        }
    }

    modelUpdate(): void {
        this.fireboardDataService.handlerFilter({ filterKey: this.legoData.key, type: this.typeFilter });
        this.cdr.detectChanges();
    }

    modelFilterUpdate(filterValue = null) {
        this.fireboardDataService.setFilterValue(this.legoData.key, filterValue);
    }
}
