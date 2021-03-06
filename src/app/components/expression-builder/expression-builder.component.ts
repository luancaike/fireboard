import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { parse } from './models/parser';
import { syntax } from './models/syntax';
import { OPERATOR, TOKEN, tokenize } from './models/tokenizer';
import { PopoverComponent } from '../popover/popover.component';
import { DataSourceKey, DataSourceKeyTypes } from '../../models/data-source.dtos';
import { FUNCTIONS } from './models';
import { compile } from './models/compile';

@Component({
    selector: 'fb-expression-builder',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './expression-builder.component.html',
    styleUrls: ['./expression-builder.component.scss']
})
export class ExpressionBuilderComponent implements AfterViewInit {
    @ViewChild('editorContainer') editorContainer: ElementRef<HTMLDivElement>;
    @ViewChild('editor') editor: ElementRef<HTMLDivElement>;
    @ViewChild('suggestionsPopover') suggestionsPopover: PopoverComponent;
    @Output() save = new EventEmitter();
    @Input() columnTitle = '';
    @Input() columns: DataSourceKey[] = [];

    constructor(private cdr: ChangeDetectorRef) {}

    public get suggestionOptions() {
        return this.columns.map((el, id) => ({ text: `${el.name}`, id }));
    }

    public get isValid() {
        return this.columnTitle.length && !this.errors.length;
    }

    public source = '';
    public showErrors = false;
    public errors = [];
    public expression = [];
    public suggestionFunctions = [
        {
            text: 'abs',
            id: 'abs'
        },
        {
            text: 'case',
            id: 'case'
        },
        {
            text: 'concat',
            id: 'concat'
        },
        {
            text: 'lower',
            id: 'lower'
        },
        {
            text: 'upper',
            id: 'upper'
        },
        {
            text: 'count',
            id: 'count'
        },
        {
            text: 'max',
            id: 'max'
        },
        {
            text: 'min',
            id: 'min'
        },
        {
            text: 'avg',
            id: 'avg'
        },
        {
            text: 'sum',
            id: 'sum'
        }
    ];
    public selectedSuggestionIndex;
    public suggestionResults = [];
    public suggestionFunctionsResults = [];
    public suggestionSelected: any = {};

    ngAfterViewInit(): void {
        this.updateEditor();
    }

    getTextSegments(element) {
        const textSegments = [];
        Array.from(element.childNodes).forEach((node: any) => {
            switch (node.nodeType) {
                case Node.TEXT_NODE:
                    textSegments.push({ text: node.nodeValue, node });
                    break;

                case Node.ELEMENT_NODE:
                    textSegments.splice(textSegments.length, 0, ...this.getTextSegments(node));
                    break;

                default:
                    throw new Error(`Unexpected node type: ${node.nodeType}`);
            }
        });
        return textSegments;
    }

    getSelectIndex() {
        const sel = window.getSelection();
        const textSegments = this.getTextSegments(this.editor.nativeElement);
        let anchorIndex = null;
        let focusIndex = null;
        let currentIndex = 0;

        textSegments.forEach(({ text, node }) => {
            if (node === sel.anchorNode) {
                anchorIndex = currentIndex + sel.anchorOffset;
            }
            if (node === sel.focusNode) {
                focusIndex = currentIndex + sel.focusOffset;
            }
            currentIndex += text.length;
        });
        return { anchorIndex, focusIndex, textSegments };
    }

    selectSuggestions(event: UIEvent, suggestion, type: 'identifier' | 'function' = 'identifier') {
        event.preventDefault();
        if (type === 'identifier') {
            suggestion = `[${suggestion}]`;
        }
        if (type === 'function') {
            suggestion = `${suggestion}()`;
        }
        const { anchorIndex, focusIndex, textSegments } = this.getSelectIndex();
        const textContent = textSegments.map(({ text }) => text).join('');
        const start = !!~this.suggestionSelected.start ? this.suggestionSelected.start : anchorIndex;
        const end =
            !!~this.suggestionSelected.end && this.suggestionSelected.end !== null
                ? this.suggestionSelected.end
                : anchorIndex === focusIndex
                ? anchorIndex
                : focusIndex;
        const prefix = textContent.slice(0, start);
        const postfix = textContent.slice(end);

        const openParen = suggestion[suggestion.length] === '(';
        const alreadyOpenParen = postfix.trim()[0] === '(';
        const extraTrim = openParen && alreadyOpenParen ? 1 : 0;
        const replacement = suggestion.slice(0, suggestion.length - extraTrim);

        const updatedExpression = prefix + replacement.trim() + postfix;
        this.renderText(updatedExpression);

        this.suggestionsPopover.hide();
        this.editor.nativeElement.focus();
        const indexOfSuggestion = suggestion.length + start - (type === 'function' ? 1 : 0);
        this.restoreSelection(indexOfSuggestion, indexOfSuggestion);
        this.hiddenSuggestions();
    }

    keydown(e: KeyboardEvent) {
        const allSuggestions = [
            ...this.suggestionResults.map((el) => ({ ...el, type: 'identifier' })),
            ...this.suggestionFunctionsResults.map((el) => ({ ...el, type: 'function' }))
        ];
        this.showSuggestions();
        if (e.key === 'Enter' || e.key === 'Escape') {
            e.stopPropagation();
            e.preventDefault();
            if (e.key === 'Enter' && this.selectedSuggestionIndex) {
                this.selectSuggestions(e, this.selectedSuggestionIndex.text, this.selectedSuggestionIndex.type);
            }
            this.hiddenSuggestions();
            return;
        }

        if (!allSuggestions.length) {
            return;
        }

        if (e.key === 'ArrowDown') {
            e.stopPropagation();
            e.preventDefault();
            if (this.selectedSuggestionIndex) {
                const index = allSuggestions.findIndex((el) => this.selectedSuggestionIndex.id === el.id);
                const indexPlus = index + 1;
                const indexMax = allSuggestions.length - 1;
                const indexElement = index < 0 ? 0 : indexPlus > indexMax ? indexMax : indexPlus;
                this.selectedSuggestionIndex = allSuggestions[indexElement];
            } else {
                this.selectedSuggestionIndex = allSuggestions[0];
            }
            this.showFocusedSuggestions();
        }
        if (e.key === 'ArrowUp') {
            e.stopPropagation();
            e.preventDefault();
            if (this.selectedSuggestionIndex) {
                const index = allSuggestions.findIndex((el) => this.selectedSuggestionIndex.id === el.id);
                const indexMinus = index - 1;
                const indexElement = indexMinus < 0 ? 0 : indexMinus;
                this.selectedSuggestionIndex = allSuggestions[indexElement];
            }
            this.showFocusedSuggestions();
        }
    }

    showFocusedSuggestions() {
        this.cdr.detectChanges();
        setTimeout(
            () =>
                document
                    .querySelector('.suggestion-item.focused')
                    ?.scrollIntoView({ inline: 'nearest', block: 'nearest' }),
            300
        );
    }

    showSuggestions() {
        const { anchorIndex, focusIndex, textSegments } = this.getSelectIndex();
        const textContent = textSegments.map(({ text }) => text).join('');
        let result = '';
        let start = null;
        let end = null;
        let index = 0;
        if (anchorIndex === focusIndex) {
            const suggest = [];
            while (index < textContent.length) {
                const char = textContent[anchorIndex - 1 - index];
                if (
                    char &&
                    char !== `'` &&
                    char !== '"' &&
                    char !== ']' &&
                    char !== ' ' &&
                    Object.keys(OPERATOR).every((key) => OPERATOR[key] !== char)
                ) {
                    if (end === null) {
                        end = anchorIndex - index;
                    }
                    suggest.push(char);
                } else {
                    start = anchorIndex - index;
                    break;
                }
                ++index;
            }
            result = suggest.reduce((acc, item) => [item, ...acc], []).join('');
        }
        start = start ? start : anchorIndex - index;
        this.suggestionSelected = {
            start,
            end,
            text: textContent.slice(start, end)
        };

        result = result.replace(/\[/g, '');
        this.suggestionResults = this.suggestionOptions.filter((item) =>
            item.text.toLowerCase().startsWith(result.toLowerCase())
        );
        this.suggestionFunctionsResults = this.suggestionFunctions.filter((item) =>
            item.text.toLowerCase().startsWith(result.toLowerCase())
        );
        if (this.suggestionResults.length || this.suggestionFunctionsResults.length) {
            this.showSuggestionsPopover();
        } else {
            this.hiddenSuggestions();
        }
        this.cdr.detectChanges();
    }

    showSuggestionsPopover() {
        setTimeout(() => this.suggestionsPopover.show({ target: this.editor.nativeElement } as any));
    }

    hiddenSuggestions() {
        this.suggestionsPopover.hide();
        this.selectedSuggestionIndex = null;
    }

    blurEditor() {
        this.showErrors = true;
    }

    updateEditor() {
        const { anchorIndex, focusIndex, textSegments } = this.getSelectIndex();
        const textContent = textSegments.map(({ text }) => text).join('');
        this.renderText(textContent);
        this.restoreSelection(anchorIndex, focusIndex);
    }

    restoreSelection(absoluteAnchorIndex, absoluteFocusIndex) {
        const sel = window.getSelection();
        const textSegments = this.getTextSegments(this.editor.nativeElement);
        let anchorNode = this.editor.nativeElement;
        let anchorIndex = 0;
        let focusNode = this.editor.nativeElement;
        let focusIndex = 0;
        let currentIndex = 0;
        textSegments.forEach(({ text, node }) => {
            const startIndexOfNode = currentIndex;
            const endIndexOfNode = startIndexOfNode + text.length;
            if (startIndexOfNode <= absoluteAnchorIndex && absoluteAnchorIndex <= endIndexOfNode) {
                anchorNode = node;
                anchorIndex = absoluteAnchorIndex - startIndexOfNode;
            }
            if (startIndexOfNode <= absoluteFocusIndex && absoluteFocusIndex <= endIndexOfNode) {
                focusNode = node;
                focusIndex = absoluteFocusIndex - startIndexOfNode;
            }
            currentIndex += text.length;
        });

        sel.setBaseAndExtent(anchorNode, anchorIndex, focusNode, focusIndex);
    }

    renderHTML(html: string) {
        this.editor.nativeElement.innerHTML = `<span>${html && html.length ? html : `<br>`}</span>`;
    }

    renderText(source: string) {
        this.source = source;
        this.errors = [];

        let syntaxTree;
        let compileError = [];

        const { tokens, errors } = tokenize(source);
        const options = {
            source
        };

        this.checkTokensAndColumns(source, tokens);

        const { cst, parserErrors, lexerErrors, typeErrors, tokenVector } = parse({
            ...options,
            recover: true
        });

        if (typeErrors.length > 0 || parserErrors.length > 0) {
            compileError = typeErrors.concat(parserErrors);
        } else {
            try {
                this.expression = compile({
                    cst,
                    tokenVector,
                    query: {
                        dimensionOptions: () => {
                            return this.columns;
                        }
                    },
                    ...options
                });
            } catch (e) {
                compileError = [e];
            }
        }

        if ([...parserErrors, ...lexerErrors, ...typeErrors, ...errors, ...compileError].length) {
            this.errors = [...this.errors, { message: 'Erro de Sintaxe' }];
        }

        try {
            syntaxTree = syntax({ cst, tokenVector, ...options });
        } catch (e) {
            console.warn('syntax error', e);
        }

        const renderSyntaxTree = (node) => {
            return `<span class="node ${node.type}">${
                node.text ? node.text : node.children ? node.children.map(renderSyntaxTree).join('') : null
            }</span>`;
        };

        if (!syntaxTree) {
            this.renderHTML(source);
        } else {
            this.showSuggestions();
            this.renderHTML(renderSyntaxTree(syntaxTree));
        }
    }

    checkTokensAndColumns(source, tokens: any[]) {
        const Identifiers = tokens
            .filter((token) => token.type === TOKEN.Identifier)
            .map((ed) => source.slice(ed.start, ed.end).replace(/[\[\]]/g, ''));
        const columns = Identifiers.filter(
            (ident) =>
                !(
                    FUNCTIONS.has(ident) ||
                    this.suggestionOptions.find((o) => !!~o.text.indexOf(ident)) ||
                    this.suggestionFunctions.find((o) => !!~o.text.indexOf(ident))
                )
        );
        if (columns.length) {
            this.errors.push({ message: `Coluna [${columns[0]}] n??o existe` });
        }
    }

    resetExpression() {
        this.renderHTML('');
        this.errors = [];
        this.columnTitle = '';
    }

    saveExpression() {
        this.save.emit({
            name: this.columnTitle,
            type: DataSourceKeyTypes.Custom,
            source: this.source,
            expression: this.expression
        });
        this.resetExpression();
    }
}
