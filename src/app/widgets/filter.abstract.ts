import { WidgetAbstract } from './widget.abstract';

export abstract class FilterAbstract extends WidgetAbstract {
    abstract filterKey: string;

    abstract filterAction(...any): any[];

    updateFilterOnServiceData() {
        this.fireboardDataService.addFilterControl({
            key: this.filterKey,
            filterAction: (...args) => this.filterAction(...args),
            dataSource: this.dataSource
        });
    }

    setDataSource(dataSource: number) {
        this.updateFilterOnServiceData();
        super.setDataSource(dataSource);
    }
}
