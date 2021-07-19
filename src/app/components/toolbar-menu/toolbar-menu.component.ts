import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { debounce } from '../../utils/effects';
import { FireboardComponent } from '../../fireboard.component';

@Component({
    selector: 'fb-toolbar-menu',
    templateUrl: './toolbar-menu.component.html',
    styleUrls: ['./toolbar-menu.component.scss']
})
export class ToolbarMenuComponent {
    @ViewChild('subMenu') subMenu: ElementRef<HTMLDivElement>;
    @Input() dashboard: FireboardComponent;
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
                    icon: 'file-download',
                    action: (): any => this.dashboard.exportData()
                },
                {
                    title: 'Importar',
                    icon: 'file-upload',
                    separator: true,
                    action: (): any => this.dashboard.importData()
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
                    action: (): any => this.dashboard.craftable.undo(),
                    icon: 'undo',
                    short: 'Ctrl+Z'
                },
                {
                    title: 'Refazer',
                    action: (): any => this.dashboard.craftable.redo(),
                    icon: 'redo',
                    short: 'Ctrl+Shift+Z',
                    separator: true
                },
                {
                    title: 'Cortar',
                    action: (): any => this.dashboard.craftable.cut(),
                    icon: 'cut',
                    short: 'Ctrl+X'
                },
                {
                    title: 'Copiar',
                    action: (): any => this.dashboard.craftable.copy(),
                    icon: 'copy',
                    short: 'Ctrl+C'
                },
                {
                    title: 'Colar',
                    action: (): any => this.dashboard.craftable.paste(),
                    icon: 'paste',
                    short: 'Ctrl+V'
                },
                {
                    title: 'Eliminar',
                    action: (): any => this.dashboard.craftable.deleteSelection(),
                    short: 'Delete'
                },
                {
                    title: 'Duplicar',
                    action: (): any => this.dashboard.craftable.duplicate(),
                    short: 'Ctrl+D',
                    separator: true
                },
                {
                    title: 'Selecionar tudo',
                    action: (): any => this.dashboard.craftable.selectAll(),
                    short: 'Ctrl+A'
                },
                {
                    title: 'Não selecionar nada',
                    action: (): any => this.dashboard.craftable.unSelectAll(),
                    short: 'Ctrl+Shift+A'
                }
            ]
        },
        {
            title: 'Organizar',
            children: [
                {
                    title: 'Trazer para a frente',
                    action: (): any => this.dashboard.craftable.bringToForward(),
                    short: 'Ctrl+Shift+↑'
                },
                {
                    title: 'Trazer para diante',
                    action: (): any => this.dashboard.craftable.bringToFront(),
                    short: 'Ctrl+↑'
                },
                {
                    title: 'Enviar para a trás',
                    action: (): any => this.dashboard.craftable.bringToBack(),
                    short: 'Ctrl+↓'
                },
                {
                    title: 'Enviar para último plano',
                    action: (): any => this.dashboard.craftable.bringToBackward(),
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
