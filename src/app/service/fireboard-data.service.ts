import { EventEmitter, Injectable } from '@angular/core';
import { DataGetter } from '../widgets/widget.abstract';
import { DataSourceDataMockList } from '../models/mocks';
import { FilterModel } from '../models/data-source.dtos';
import { CustomFilterDto } from '../components/filter-maker/filter-maker.model';
import { FilterDto, FilterHandlerDto } from '../models/filter.dtos';

const randomTimer = () => Math.random() * (3000 - 300) + 300;

@Injectable({ providedIn: 'root' })
export class FireboardDataService {
    private filtersControl: FilterDto[] = [];
    public filterEventEmitter = new EventEmitter<FilterHandlerDto>();

    dataGetter = (data: DataGetter): Promise<any[]> => {
        return new Promise((resolve) => {
            const result = DataSourceDataMockList.find((value) => value.id === data.id);
            const dataList = result ? result.data : [];
            const dataResult = this.filtersControl
                .filter((filter) => filter.dataSource === data.id)
                .reduce((acc, item) => item.filterAction(acc), dataList);
            setTimeout(() => resolve(dataResult), randomTimer());
        });
    };
    addExternalFilter = (data: CustomFilterDto): Promise<FilterModel> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ id: 100, name: data.label }), randomTimer());
        });
    };
    getExternalFilters = (sourceId: number): Promise<FilterModel[]> => {
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

    addFilterControl(filter: FilterDto) {
        const result = this.filtersControl.find((el) => el.key === filter.key);
        if (result) {
            this.filtersControl = this.filtersControl.map((el) => {
                if (el.key === filter.key) {
                    return filter;
                }
                return el;
            });
        } else {
            this.filtersControl.push(filter);
        }
    }

    removeFilterControl(filterKey: string) {
        this.filtersControl = this.filtersControl.filter(({ key }) => key !== filterKey);
    }
}
