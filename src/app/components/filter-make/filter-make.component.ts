import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    ColumnOperators,
    CustomFilterDto,
    OperatorsNumber,
    OperatorsText,
    ReturnTypes,
    TypeExpression
} from './filter-make.model';
import { DataSourceKey } from '../../models/data-source.dtos';

@Component({
    selector: 'fb-filter',
    template: `
        <div class="row h-100">
            <div class="col-12">
                <div
                    class="card border-0"
                    style="display: flex;
                                        justify-content: space-between;
                                        height: 100%;"
                >
                    <div class="card-header bg-primary text-white d-flex justify-content-between">
                        <h5 style="margin: .5rem;">
                            <fa-icon icon="filter" class="mr-2"></fa-icon>
                            Criar Novo Filtro
                        </h5>
                        <button class="btn btn-outline-light btn-sm" (click)="showPanel = false">
                            FECHAR
                            <fa-icon icon="times" class="ml-2"></fa-icon>
                        </button>
                    </div>
                    <div class="row mt-2 justify-content-around border-bottom">
                        <div class="col-5 form-group">
                            <input required placeholder="Nome" [(ngModel)]="customFilter.label" class="form-control" />
                        </div>
                    </div>
                    <div
                        class="card-body py-4 scroll-style"
                        style="max-height: 460px;overflow-x: hidden;overflow-y: auto;"
                    >
                        <ng-container
                            *ngTemplateOutlet="queryConfig; context: { model: customFilter.expression }"
                        ></ng-container>
                    </div>
                    <div class="card-footer text-muted d-flex justify-content-end">
                        <button class="btn btn-primary ml-3" (click)="salvarExpression()">
                            <fa-icon icon="save" class="mr-2"></fa-icon>
                            SALVAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <ng-template #queryRule let-model="model" let-parent="parent">
            <div class="query-container-rule">
                <div class="query-param-rule">
                    <label>Colunas</label>
                    <fb-select-column
                        [valueChange]="valueChange(model)"
                        [value]="model.selectedColumn"
                        placeholder="Colunas"
                        [searchable]="true"
                        [clearable]="false"
                        [items]="columnsData"
                    ></fb-select-column>
                </div>
                <div class="query-param-rule" *ngIf="model.selectedColumn">
                    <label>Operadores</label>
                    <ng-select
                        class="ng-select-sm"
                        [(ngModel)]="model.selectedOperator"
                        placeholder="Operadores"
                        [searchable]="true"
                        [clearable]="false"
                        [items]="model.selectedColumn?.type === 'number' ? operatorsNumber : operatorsText"
                        style="flex-grow: 1"
                    >
                    </ng-select>
                </div>
                <div class="query-param-rule">
                    <label>&nbsp;</label>
                    <ng-select
                        class="ng-select-sm"
                        *ngIf="showSelectBetweenParams(model)"
                        [addTag]="true"
                        (ngModelChange)="model.selectedParameters = $event"
                        [ngModel]="model.selectedParameters"
                        [multiple]="true"
                        [searchable]="true"
                        [clearable]="false"
                        [items]="valuesOfColumnSelected"
                        style="flex-grow: 1"
                    >
                    </ng-select>
                    <ng-select
                        class="ng-select-sm"
                        #selectParams
                        *ngIf="showSelectParams(model)"
                        [addTag]="true"
                        (ngModelChange)="model.selectedParameters = $event"
                        [ngModel]="model.selectedParameters"
                        [searchable]="true"
                        [clearable]="false"
                        [items]="valuesOfColumnSelected"
                        style="flex-grow: 1"
                    >
                    </ng-select>
                    <div class="input-group" *ngIf="showNumberBetweenParams(model)">
                        <input
                            type="number"
                            placeholder="De"
                            (ngModelChange)="setBetweenModel(model, 'from', $event)"
                            [ngModel]="getBetweenModel(model, 'from')"
                            class="form-control"
                        />
                        <input
                            type="number"
                            placeholder="Até"
                            (ngModelChange)="setBetweenModel(model, 'to', $event)"
                            [ngModel]="getBetweenModel(model, 'to')"
                            class="form-control"
                        />
                    </div>
                    <input
                        *ngIf="showNumberParams(model)"
                        class="form-control"
                        type="number"
                        [(ngModel)]="model.selectedParameters"
                    />
                    <input
                        *ngIf="showStringParams(model)"
                        type="text"
                        class="form-control"
                        [(ngModel)]="model.selectedParameters"
                    />
                </div>
                <fa-icon icon="times" class="text-danger remove-rule" (click)="removeItem(parent, model)"></fa-icon>
            </div>
        </ng-template>
        <ng-template #queryConfig let-model="model" let-parent="parent">
            <div class="query-header">
                <div class="btn-toolbar">
                    <div class="btn-group mr-2">
                        <button
                            type="button"
                            class="btn btn-outline-secondary"
                            [class.active]="model.logicalOperators === 'AND'"
                            (click)="model.logicalOperators = 'AND'"
                        >
                            E
                        </button>
                        <button
                            [class.active]="model.logicalOperators === 'OR'"
                            (click)="model.logicalOperators = 'OR'"
                            type="button"
                            class="btn btn-outline-secondary"
                        >
                            OU
                        </button>
                    </div>
                    <div class="btn-group">
                        <button type="button" class="btn btn-outline-primary" (click)="addCondition(model.rules)">
                            <fa-icon icon="plus" class="mr-2"></fa-icon>
                            Condição
                        </button>
                        <button type="button" class="btn btn-outline-primary" (click)="addGroup(model.rules)">
                            <fa-icon icon="layer-group" class="mr-2"></fa-icon>
                            Grupo
                        </button>
                    </div>
                    <div class="btn-group remove-group" *ngIf="parent">
                        <button type="button" class="btn btn-outline-danger" (click)="removeItem(parent, model)">
                            <fa-icon icon="times"></fa-icon>
                        </button>
                    </div>
                </div>
            </div>
            <div class="row query-container">
                <ng-container *ngFor="let rule of model.rules">
                    <div class="col-12 query-group" *ngIf="rule.type === 2">
                        <ng-container
                            *ngTemplateOutlet="queryConfig; context: { model: rule, parent: model.rules }"
                        ></ng-container>
                    </div>
                    <div class="col-12 query-rule" *ngIf="rule.type === 1">
                        <ng-container
                            *ngTemplateOutlet="queryRule; context: { model: rule, parent: model.rules }"
                        ></ng-container>
                    </div>
                </ng-container>
            </div>
        </ng-template>
    `,
    styleUrls: ['./filter-make.component.scss']
})
export class FilterMakeComponent {
    @Output() showPanelChange = new EventEmitter();
    @Output() addFilter = new EventEmitter();
    @Input() columnsData: DataSourceKey[] = [];
    @Input() sourceData: any[] = [];

    @Input() set showPanel(value: boolean) {
        this.showPanelChange.emit(value);
        this._showPanel = value;
    }
    get showPanel(): boolean {
        return this._showPanel;
    }

    nameNewColumn: string;
    valuesOfColumnSelected = [];
    returnTypes = ReturnTypes;
    customFilter: CustomFilterDto = {
        label: null,
        expression: {
            elseExpression: null,
            elseIfExpression: [],
            returnData: [],
            type: TypeExpression.GROUP,
            logicalOperators: 'AND',
            rules: [
                {
                    selectedColumn: null,
                    selectedOperator: null,
                    selectedParameters: null,
                    type: TypeExpression.CONDITION
                }
            ]
        }
    };
    operatorsText = OperatorsText;
    operatorsNumber = OperatorsNumber;

    private _showPanel = false;

    valueChange = (model: any) => (value) => {
        model.selectedColumn = value;
    };

    moveReturn = (event: CdkDragDrop<string[]>, data) => {
        moveItemInArray(data, event.previousIndex, event.currentIndex);
    };

    onSelectColumn = (model) => {
        this.setValuesOfColumn(model);
        model.selectedOperator =
            model.selectedColumn && model.selectedColumn.type === 'number'
                ? this.operatorsNumber[0]
                : this.operatorsText[0];
    };
    getBetweenModel = (model, key) => {
        if (model.selectedParameters === null || typeof model.selectedParameters !== 'object') {
            model.selectedParameters = {};
        }
        return model.selectedParameters[key];
    };
    setBetweenModel = (model, key, value) => {
        if (model.selectedParameters === null || typeof model.selectedParameters !== 'object') {
            model.selectedParameters = {};
        }
        return (model.selectedParameters[key] = value);
    };
    setValuesOfColumn = (model) => {
        let data = [];
        if (model.selectedColumn) {
            data = this.sourceData.reduce((acc, el) => {
                const value = el[model.selectedColumn.key];
                if (!acc.some((d) => d === value)) {
                    acc.push(value);
                }
                return acc;
            }, []);
        }
        this.valuesOfColumnSelected = data;
    };
    showSelectParams = (model) => {
        if (model.selectedOperator && model.selectedColumn) {
            const operators = [ColumnOperators.Equal, ColumnOperators.NotEqual];
            return operators.some((o) => o === model.selectedOperator.value);
        }
    };
    showNumberBetweenParams = (model) => {
        if (model.selectedOperator && model.selectedColumn) {
            if (model.selectedColumn.type !== 'number') {
                return false;
            }
            const operators = [ColumnOperators.NotBetween, ColumnOperators.Between];
            return operators.some((o) => o === model.selectedOperator.value);
        }
    };

    showSelectBetweenParams = (model) => {
        if (model.selectedOperator && model.selectedColumn) {
            const operators = [ColumnOperators.In, ColumnOperators.NotIn];
            return operators.some((o) => o === model.selectedOperator.value);
        }
    };

    showNumberParams = (model) => {
        if (model.selectedOperator && model.selectedColumn) {
            if (model.selectedColumn.type !== 'number') {
                return false;
            }
            const operators = [
                ColumnOperators.GreaterThan,
                ColumnOperators.GreaterThanOrEqual,
                ColumnOperators.LessThan,
                ColumnOperators.LessThanOrEqual
            ];
            return operators.some((o) => o === model.selectedOperator.value);
        }
    };
    showStringParams = (model) => {
        if (model.selectedOperator && model.selectedColumn) {
            if (model.selectedColumn.type !== 'string') {
                return false;
            }
            const operators = [ColumnOperators.StartsWith, ColumnOperators.EndsWith, ColumnOperators.Contains];
            return operators.some((o) => o === model.selectedOperator.value);
        }
    };

    removeItem = (data: any[], item: any) => {
        data.splice(data.indexOf(item), 1);
    };

    addCondition = (data: any[]) => {
        data.push({
            selectedColumn: null,
            selectedOperator: null,
            selectedParameters: null,
            type: TypeExpression.CONDITION
        });
    };

    addGroup = (data: any[]) => {
        data.push({
            type: TypeExpression.GROUP,
            logicalOperators: 'AND',
            rules: [
                {
                    selectedColumn: null,
                    selectedOperator: null,
                    selectedParameters: null,
                    type: TypeExpression.CONDITION
                }
            ]
        });
    };
    salvarExpression = () => {
        try {
            this.addFilter.emit(this.customFilter);
            this.showPanel = false;
        } catch (e) {
            console.log('ERRO');
            console.log(e);
        }
    };
}
