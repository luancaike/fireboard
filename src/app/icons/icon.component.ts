import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { icons, IconsName } from './icons';

@Component({
    selector: 'fb-icon',
    styles: [
        `
            :host {
                display: inline-block;
                width: 48px;
                height: 36px;
            }
        `
    ],
    template: ` <div #template></div>`
})
export class FbIconComponent implements OnChanges, AfterViewInit {
    @ViewChild('template') template: ElementRef<HTMLDivElement>;
    @Input() icon: IconsName;

    private getIcon(): string {
        return icons.find((icon) => this.icon === icon.name)?.data;
    }

    private setIcon(): void {
        if (this.template) {
            this.template.nativeElement.innerHTML = this.getIcon();
        }
    }

    ngOnChanges(): void {
        this.setIcon();
    }

    ngAfterViewInit(): void {
        this.setIcon();
    }
}
