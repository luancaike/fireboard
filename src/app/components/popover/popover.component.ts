import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';

@Component({
    selector: 'fb-popover',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.scss']
})
export class PopoverComponent {
    @ViewChild('popover') popover: ElementRef<HTMLDivElement>;
    @Input() title = '';
    @Input() hiddenHeader = false;
    @Output() clickOutside = new EventEmitter();
    isShow = false;
    openToTop = false;

    show(event?: MouseEvent) {
        this.isShow = true;
        this.popover.nativeElement.classList.add('show');

        const rect = (event?.target as HTMLDivElement)?.getBoundingClientRect();
        const popoverRect = this.popover.nativeElement?.getBoundingClientRect();
        if (rect) {
            const maxHeight = window.screen.height / 2;
            this.openToTop = rect.top >= maxHeight;
            this.popover.nativeElement.style.top = `${
                this.openToTop ? Math.abs(rect.top - popoverRect.height) : rect.top + rect.height
            }px`;
            this.popover.nativeElement.style.left = `${rect.left}px`;
        }
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
