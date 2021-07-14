import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { debounce } from '../../utils/effects';
import { CraftableComponent } from 'ng-craftable';

@Component({
    selector: 'fb-toolbar-menu',
    templateUrl: './toolbar-menu.component.html',
    styleUrls: ['./toolbar-menu.component.scss']
})
export class ToolbarMenuComponent {
    @ViewChild('subMenu') subMenu: ElementRef<HTMLDivElement>;
    @Input() craftable: CraftableComponent;
    menuSubOptions = [];
    menuOptions = [
        {
            title: 'Arquivo',
            children: [
                {
                    disabled: false,
                    title: 'Salvar',
                    icon: 'save',
                    short: 'Ctrl+S',
                    action: (): any => console.log('Salvar'),
                    separator: true
                },
                {
                    title: 'Exportar',
                    icon: 'file-download'
                },
                {
                    title: 'Importar',
                    icon: 'file-upload',
                    separator: true
                },
                {
                    title: 'Sair',
                    icon: 'sign-out-alt'
                }
            ]
        },
        {
            title: 'Editar',
            children: [
                {
                    title: 'Anular',
                    action: (): any => this.craftable.undo(),
                    icon: 'undo',
                    short: 'Ctrl+Z'
                },
                {
                    title: 'Refazer',
                    action: (): any => this.craftable.redo(),
                    icon: 'redo',
                    short: 'Ctrl+Shift+Z',
                    separator: true
                },
                {
                    title: 'Cortar',
                    action: (): any => this.craftable.cut(),
                    icon: 'cut',
                    short: 'Ctrl+X'
                },
                {
                    title: 'Copiar',
                    action: (): any => this.craftable.copy(),
                    icon: 'copy',
                    short: 'Ctrl+C'
                },
                {
                    title: 'Colar',
                    action: (): any => this.craftable.paste(),
                    icon: 'paste',
                    short: 'Ctrl+V'
                },
                {
                    title: 'Eliminar',
                    action: (): any => this.craftable.deleteSelection(),
                    short: 'Delete'
                },
                {
                    title: 'Duplicar',
                    action: (): any => this.craftable.duplicate(),
                    short: 'Ctrl+D',
                    separator: true
                },
                {
                    title: 'Selecionar tudo',
                    action: (): any => this.craftable.selectAll(),
                    short: 'Ctrl+A'
                },
                {
                    title: 'Não selecionar nada',
                    action: (): any => this.craftable.unSelectAll(),
                    short: 'Ctrl+Shift+A'
                }
            ]
        },
        {
            title: 'Organizar',
            children: [
                {
                    title: 'Trazer para a frente',
                    action: (): any => this.craftable.bringToForward(),
                    short: 'Ctrl+Shift+↑'
                },
                {
                    title: 'Trazer para diante',
                    action: (): any => this.craftable.bringToFront(),
                    short: 'Ctrl+↑'
                },
                {
                    title: 'Enviar para a trás',
                    action: (): any => this.craftable.bringToBack(),
                    short: 'Ctrl+↓'
                },
                {
                    title: 'Enviar para último plano',
                    action: (): any => this.craftable.bringToBackward(),
                    short: 'Ctrl+Shift+↓'
                }
            ]
        }
    ];

    selectMenu(menu: HTMLElement): void {
        menu.classList.add('selected');
        this.menuSubOptions = [];
    }

    callActionMenu(menu: HTMLElement, action: () => void): void {
        menu.classList.remove('selected');
        if (typeof action === 'function') {
            action();
        }
    }

    @debounce(100)
    blurMenu(menu: HTMLElement): void {
        menu.classList.remove('selected');
    }

    showSubMenu(menu: HTMLElement, subMenu: HTMLElement, data: any[], index: number): void {
        this.menuSubOptions = data;
        subMenu.style.left = `${menu.offsetLeft + menu.offsetWidth}px`;
        subMenu.style.top = `${index * 35 + menu.offsetTop}px`;
    }
}
