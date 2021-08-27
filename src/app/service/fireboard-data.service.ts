import { EventEmitter, Injectable } from '@angular/core';
import { DataGetter } from '../widgets/widget.abstract';
import { DataSource, DataSourceSelected, FilterModel } from '../models/data-source.dtos';
import { CustomFilterDto } from '../components/filter-maker/filter-maker.model';
import { FilterBindKey, FilterHandlerDto, FilterQueryTypes } from '../models/filter.dtos';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastService } from './toast.service';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ChartItemConfig } from '../models/charts.dtos';

const randomTimer = () => Math.random() * (1000 - 100) + 100;

const api = 'http://localhost:2000';

@Injectable({ providedIn: 'root' })
export class FireboardDataService {
    public filterEventEmitter = new EventEmitter<FilterHandlerDto>();
    public filterBindKey: FilterBindKey[] = [];
    public filterValues = new Map<string, any>();
    public tableSources: DataSource[] = [];
    public dataSources: DataSource[] = [];
    public chartsLego: ChartItemConfig[] = [];

    constructor(private http: HttpClient, private toastService: ToastService) {}

    private catchHttpError = () => {
        return catchError((error: HttpErrorResponse) => {
            const errorsList = error?.error?.errors;
            const errorMsg = error?.error?.message;
            if (Array.isArray(errorsList)) {
                errorsList.forEach(({ message }) => this.toastService.showError(message));
            } else if (errorMsg) {
                this.toastService.showError(errorMsg);
            } else {
                this.toastService.showError('Erro Interno');
            }
            return throwError(error);
        });
    };

    // TODO: REMOVE
    async login(login: string, pass: string): Promise<any> {
        const model = {
            Username: login,
            Password: pass
        };
        const { data } = await this.http.post<any>(`${api}/api/v1/token`, model).toPromise().catch(this.catchHttpError);
        window.localStorage.setItem('token', data.accessToken);
    }

    addTableSource(model): Observable<any> {
        return this.http.post<any>(`${api}/api/v1/dashboard-builder/table-source`, model).pipe(this.catchHttpError());
    }

    addDataSource(model): Observable<any> {
        return this.http.post<any>(`${api}/api/v1/dashboard-builder/datasource`, model).pipe(this.catchHttpError());
    }

    updateDataSource(id, model): Observable<any> {
        return this.http
            .put<any>(`${api}/api/v1/dashboard-builder/datasource/${id}`, model)
            .pipe(this.catchHttpError());
    }

    getDataSource(id): Observable<any> {
        return this.http.get<any>(`${api}/api/v1/dashboard-builder/datasource/${id}`).pipe(this.catchHttpError());
    }

    removeDataSource(id): Observable<any> {
        return this.http.delete<any>(`${api}/api/v1/dashboard-builder/datasource/${id}`).pipe(this.catchHttpError());
    }

    previewDataSource(model): Observable<any> {
        return this.http
            .post<any>(`${api}/api/v1/dashboard-builder/datasource/test`, model)
            .pipe(this.catchHttpError());
    }

    getDataOfSource(
        id,
        filter = {
            filters: []
        }
    ): Observable<any> {
        return this.http
            .post<any>(`${api}/api/v1/dashboard-builder/datasource/data/${id}`, filter)
            .pipe(this.catchHttpError());
    }

    getTableSources(): Observable<any> {
        return this.http.get(`${api}/api/v1/dashboard-builder/table-source`).pipe(this.catchHttpError());
    }

    getDataSources(): Observable<any> {
        return this.http.get(`${api}/api/v1/dashboard-builder/datasource`).pipe(this.catchHttpError());
    }

    getChartsLego(): Observable<any> {
        return this.http.get(`${api}/api/v1/dashboard-builder/chart`).pipe(this.catchHttpError());
    }

    getChartLegoById(id): Observable<any> {
        return this.http.get(`${api}/api/v1/dashboard-builder/chart/${id}`).pipe(this.catchHttpError());
    }

    deleteChart(id): Observable<any> {
        return this.http.delete(`${api}/api/v1/dashboard-builder/chart/${id}`).pipe(this.catchHttpError());
    }

    addChartLego(model): Observable<any> {
        return this.http.post(`${api}/api/v1/dashboard-builder/chart`, model).pipe(this.catchHttpError());
    }

    editChartLego(id, model): Observable<any> {
        return this.http.put(`${api}/api/v1/dashboard-builder/chart/${id}`, model).pipe(this.catchHttpError());
    }

    searchTable(table: string): Observable<any> {
        return this.http.get(`${api}/api/v1/dashboard-builder/table-columns/${table}`).pipe(this.catchHttpError());
    }

    getData() {
        this.updateTableSources();
        this.updateDataSources();
        this.updateChartsLego();
    }

    updateTableSources() {
        const result = this.getTableSources();
        result.subscribe(({ data }) => (this.tableSources = data));
        return result;
    }

    updateDataSources() {
        const result = this.getDataSources();
        result.subscribe(({ data }) => (this.dataSources = data));
        return result;
    }

    updateChartsLego() {
        const result = this.getChartsLego();
        result.subscribe(({ data }) => (this.chartsLego = data));
        return result;
    }

    async dataGetter(data: DataGetter): Promise<any[]> {
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
        return new Promise<any[]>((resolve) => {
            this.getDataOfSource(data.sourceId).subscribe(({ data }) => {
                const dataResult = data?.result ?? [];
                resolve(
                    query.filters.reduce((acc, item) => {
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
                    }, dataResult)
                );
            });
        });
    }

    addExternalFilter(data: CustomFilterDto): Promise<FilterModel> {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ id: 100, name: data.label }), randomTimer());
        });
    }

    getExternalFilters(sourceId: DataSourceSelected): Promise<FilterModel[]> {
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
    }

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
