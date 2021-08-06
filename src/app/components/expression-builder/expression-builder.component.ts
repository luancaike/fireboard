import {
    AfterViewInit,
    ChangeDetectionStrategy,
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
import { DataSource, DataSourceKeyTypes } from '../../models/data-source.dtos';

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
    @Input() columns: DataSource[] = [];

    public get suggestionOptions() {
        return this.columns.reduce((acc, item) => {
            return [...acc, ...item.keys.map((el) => ({ text: `${el.name}` }))];
        }, []);
    }

    public get isValid() {
        return this.columnTitle.length && !this.errors.length;
    }

    public showErrors = false;
    public errors = [];
    public source = '';
    public columnTitle = '';
    public suggestionFunctions = [
        {
            text: 'abs',
            value: 'abs'
        },
        {
            text: 'case',
            value: 'case'
        },
        {
            text: 'concat',
            value: 'concat'
        },
        {
            text: 'lower',
            tevaluet: 'lower'
        },
        {
            text: 'upper',
            value: 'upper'
        }
    ];
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

    selectSuggestions(event: MouseEvent, suggestion, type: 'identifier' | 'function' = 'identifier') {
        event.preventDefault();
        if (type === 'identifier') {
            suggestion = `[${suggestion}]`;
        }
        if (type === 'function') {
            suggestion = `${suggestion}()`;
        }
        const { anchorIndex, focusIndex, textSegments } = this.getSelectIndex();
        const textContent = textSegments.map(({ text }) => text).join('');
        const start = this.suggestionSelected?.start || anchorIndex;
        const end = this.suggestionSelected?.end || anchorIndex === focusIndex ? anchorIndex : focusIndex;
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
    }

    keydown(e: KeyboardEvent) {
        this.showSuggestions();
        if (e.key === 'Enter' || e.key === 'Escape') {
            e.stopPropagation();
            e.preventDefault();
            this.hiddenSuggestions();
            return;
        }
    }

    showSuggestions() {
        this.hiddenSuggestions();
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

        this.suggestionSelected = {
            start: start ? start : anchorIndex - index,
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
        }
    }

    showSuggestionsPopover() {
        setTimeout(() => this.suggestionsPopover.show({ target: this.editor.nativeElement } as any));
    }

    hiddenSuggestions() {
        this.suggestionsPopover.hide();
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

        const { tokens, errors } = tokenize(source);
        const options = {
            source
        };

        this.checkTokensAndColumns(source, tokens);

        try {
            const { parserErrors, lexerErrors, typeErrors } = parse({
                ...options
            });
            this.errors = [...this.errors, ...parserErrors, ...lexerErrors, ...typeErrors, ...errors];
        } catch (errors) {
            this.errors = [...this.errors, { message: 'Erro de Sintaxe' }];
        }

        const renderSyntaxTree = (node) => {
            return `<span class="node ${node.type}">${
                node.text ? node.text : node.children ? node.children.map(renderSyntaxTree).join('') : null
            }</span>`;
        };

        const syntaxTree = syntax({ ...options });
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
                    this.suggestionOptions.find((o) => !!~o.text.indexOf(ident)) ||
                    this.suggestionFunctions.find((o) => !!~o.text.indexOf(ident))
                )
        );
        if (columns.length) {
            this.errors.push({ message: `Coluna [${columns[0]}] não existe` });
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
            source: this.source
        });
        this.resetExpression();
    }
}
