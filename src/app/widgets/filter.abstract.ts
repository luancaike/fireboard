import { WidgetAbstract } from './widget.abstract';

export abstract class FilterAbstract extends WidgetAbstract {
    abstract filterAction(data: any[]): any[];

    updateFilterOnServiceData() {
        this.fireboardDataService.addFilterControl({
            key: this.legoData.key,
            filterAction: (data) => this.filterAction(data),
            dataSource: this.dataSource
        });
    }

    setDataSource(dataSource: number) {
        super.setDataSource(dataSource);
        this.updateFilterOnServiceData();
    }
}
