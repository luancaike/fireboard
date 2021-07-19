import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    ColumnOperators,
    CustomFilterDto,
    DefaultFilterConfig,
    OperatorsNumber,
    OperatorsText,
    ReturnTypes,
    TypeExpression
} from './filter-maker.model';
import { DataSourceKey } from '../../models/data-source.dtos';
import { ExternalDataService } from '../../service/external-data.service';

@Component({
    selector: 'fb-filter-maker',
    templateUrl: './filter-maker.component.html',
    styleUrls: ['./filter-maker.component.scss']
})
export class FilterMakerComponent {
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
    customFilter: CustomFilterDto = DefaultFilterConfig();
    operatorsText = OperatorsText;
    operatorsNumber = OperatorsNumber;

    private _showPanel = false;

    valueChange = (model: any) => (value) => {
        model.selectedColumn = value;
    };

    constructor(public externalDataService: ExternalDataService) {}

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

    async saveExpression() {
        try {
            const newFilter = await this.externalDataService.addFilter(this.customFilter);
            this.addFilter.emit(newFilter);
            this.customFilter = DefaultFilterConfig();
            this.showPanel = false;
        } catch (e) {
            console.log(e);
        }
    }
}
