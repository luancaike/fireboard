import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'fb-popover',
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.scss']
})
export class PopoverComponent {
    @ViewChild('popover') popover: ElementRef<HTMLDivElement>;
    @Input() title = '';
    @Output() clickOutside = new EventEmitter();
    isShow = false;
    openToTop = false;
    rect;

    get topDiff() {
        if (this.openToTop && this.rect) {
            this.popover.nativeElement.style.top = `-${
                this.popover.nativeElement.getBoundingClientRect().height - this.rect.height
            }px`;
        } else {
            return '0px';
        }
    }

    show(event?: MouseEvent) {
        this.rect = (event.target as HTMLDivElement)?.getBoundingClientRect();
        const maxHeight = window.screen.height / 2;
        this.openToTop = this.rect.top >= maxHeight;
        this.isShow = true;
        this.popover.nativeElement.classList.add('show');
    }

    hide() {
        this.isShow = false;
        this.popover.nativeElement.classList.remove('show');
        this.clickOutside.emit();
    }

    @HostListener('document:mousedown', ['$event.target'])
    onClick(target) {
        if (this.isShow && !this.popover.nativeElement.contains(target)) {
            this.hide();
        }
    }
}
