import { Injectable } from '@angular/core';
import { DataGetter } from '../widgets/widget.abstract';
import { DataSourceDataMockList } from '../models/mocks';
import { FilterModel } from '../models/data-source.dtos';
import { CustomFilterDto } from '../components/filter-maker/filter-maker.model';
import { FilterDto } from '../models/filter.dtos';

const randomTimer = () => Math.random() * (6000 - 600) + 600;

@Injectable({ providedIn: 'root' })
export class FireboardDataService {
    private filtersControl: Map<string, FilterDto> = new Map();

    dataGetter = (data: DataGetter): Promise<any[]> => {
        return new Promise((resolve) => {
            const result = DataSourceDataMockList.find((value) => value.id === data.id);
            setTimeout(() => resolve(result ? result.data : []), randomTimer());
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

    addFilterControl(filter: FilterDto) {
        this.filtersControl.set(filter.key, filter);
    }

    removeFilterControl(filterKey: string) {
        this.filtersControl.delete(filterKey);
    }
}
