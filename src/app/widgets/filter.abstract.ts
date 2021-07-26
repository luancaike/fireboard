import { WidgetAbstract } from './widget.abstract';
import { DataSourceKey } from '../models/data-source.dtos';

export abstract class FilterAbstract extends WidgetAbstract {
    abstract filterAction(data: any[]): any[];

    getKeySelected(): DataSourceKey {
        const sourceKey = this.dataSourceSelectedKeys.find(() => true);
        return sourceKey.data.find(() => true);
    }

    modelUpdate(event: any): void {
        this.fireboardDataService.handlerFilter({ sourceKey: this.dataSource });
        this.cdr.detectChanges();
    }

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
