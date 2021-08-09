import { EventEmitter, Injectable } from '@angular/core';
import { DataGetter } from '../widgets/widget.abstract';
import { DataSourceDataMockList } from '../models/mocks';
import { DataSourceSelected, FilterModel } from '../models/data-source.dtos';
import { CustomFilterDto } from '../components/filter-maker/filter-maker.model';
import { FilterBindKey, FilterHandlerDto, FilterQueryTypes } from '../models/filter.dtos';

const randomTimer = () => Math.random() * (1000 - 100) + 100;

@Injectable({ providedIn: 'root' })
export class FireboardDataService {
    public filterEventEmitter = new EventEmitter<FilterHandlerDto>();
    public filterBindKey: FilterBindKey[] = [];
    public filterValues = new Map<string, any>();

    dataGetter = (data: DataGetter): Promise<any[]> => {
        console.log({ data, filterBindKey: this.filterBindKey, filterValues: this.filterValues });
        const query: any = {};

        query.sourceId = data.sourceId;
        query.filters = this.filterBindKey
            .filter((el) => el.widgetKey === data.widgetKey && el.dataSource === data.sourceId)
            .map((el) => ({
                key: el.keySource,
                type: el.type,
                value: this.filterValues.get(el.filterKey)
            }));
        console.log(query);
        return new Promise((resolve) => {
            const result = DataSourceDataMockList.find((value) => value.id === data.sourceId);
            const dataResult = result ? result.data : [];
            const filtered = query.filters.reduce((acc, item) => {
                if (item.type === FilterQueryTypes.DateInterval) {
                    return acc.filter((el) => {
                        {
                            const dateToCompare = new Date(el.dt_create);
                            const fromCompare = new Date(item.value.from);
                            const toCompare = new Date(item.value.to);
                            return fromCompare <= dateToCompare && dateToCompare <= toCompare;
                        }
                    });
                }
                if (item.type === FilterQueryTypes.LikeValue) {
                    return acc.filter(
                        (el) =>
                            !item.value ||
                            !item.value.length ||
                            !!~el.nm_risco.toUpperCase().indexOf(item.value.toUpperCase())
                    );
                }
                return acc;
            }, dataResult);
            setTimeout(() => resolve(filtered), randomTimer());
        });
    };

    addExternalFilter = (data: CustomFilterDto): Promise<FilterModel> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ id: 100, name: data.label }), randomTimer());
        });
    };
    getExternalFilters = (sourceId: DataSourceSelected): Promise<FilterModel[]> => {
        return new Promise((resolve) => {
            setTimeout(
                () =>
                    resolve([
                        { id: 1, name: 'teste 1' },
                        { id: 2, name: 'teste 2' },
                        { id: 3, name: 'teste 3' },
                        { id: 4, name: 'teste 4' },
                        { id: 1, name: 'teste 1' },
                        { id: 2, name: 'teste 2' },
                        { id: 3, name: 'teste 3' },
                        { id: 4, name: 'teste 4' },
                        { id: 1, name: 'teste 1' },
                        { id: 2, name: 'teste 2' },
                        { id: 3, name: 'teste 3' },
                        { id: 4, name: 'teste 4' }
                    ]),
                randomTimer()
            );
        });
    };

    handlerFilter(filter: FilterHandlerDto) {
        this.filterEventEmitter.emit(filter);
    }

    setFilterValue(filterKey, filterValue) {
        this.filterValues.set(filterKey, filterValue);
    }

    getFilter(filter: FilterBindKey) {
        return this.filterBindKey.find((el) => el.filterKey === filter.filterKey && el.widgetKey === filter.widgetKey);
    }

    addFilter(filter: FilterBindKey) {
        const index = this.filterBindKey.findIndex(
            (el) => el.filterKey === filter.filterKey && el.widgetKey === filter.widgetKey
        );
        if (index >= 0) {
            this.filterBindKey[index] = filter;
        } else {
            this.filterBindKey.push(filter);
        }
    }
}
