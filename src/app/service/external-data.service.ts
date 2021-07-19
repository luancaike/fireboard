import { Injectable } from '@angular/core';
import { DataGetter } from '../widgets/widget.abstract';
import { DataSourceDataMockList } from '../models/mocks';
import { FilterModel } from '../models/data-source.dtos';
import { CustomFilterDto } from '../components/filter-maker/filter-maker.model';

@Injectable({ providedIn: 'root' })
export class ExternalDataService {
    dataGetter = (data: DataGetter): Promise<any[]> => {
        return new Promise((resolve) => {
            const result = DataSourceDataMockList.find((value) => value.id === data.id);
            resolve(result ? result.data : []);
        });
    };
    addFilter = (data: CustomFilterDto): Promise<FilterModel> => {
        return new Promise((resolve) => {
            resolve({ id: 100, name: data.label });
        });
    };
    filtersGetter = (sourceId: number): Promise<FilterModel[]> => {
        return new Promise((resolve) => {
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
            ]);
        });
    };
}
