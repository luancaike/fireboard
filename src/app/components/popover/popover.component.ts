import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
    selector: 'fb-popover',
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.scss']
})
export class PopoverComponent {
    @ViewChild('popover') popover: ElementRef<HTMLDivElement>;
    @Input() title = '';
    isShow = false;

    show() {
        this.isShow = true;
        this.popover.nativeElement.classList.add('show');
    }

    hide() {
        this.isShow = false;
        this.popover.nativeElement.classList.remove('show');
    }

    @HostListener('document:mousedown', ['$event.target'])
    onClick(target) {
        if (this.isShow && !this.popover.nativeElement.contains(target)) {
            this.hide();
        }
    }
}
