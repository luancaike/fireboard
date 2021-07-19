import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';

@Component({
    selector: ' fb-loading-widget',
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [style({ opacity: 0 }), animate(100, style({ opacity: 1 }))]),
            transition(':leave', [animate(500, style({ opacity: 0 }))])
        ])
    ],
    styleUrls: ['./loading-widget.component.scss'],
    template: `
        <div class="loading-background" [@fadeInOut] *ngIf="show">
            <svg id="loading">
                <rect id="rect2985" width="10" height="30" x="0" y="0" rx="3" ry="3" />
                <rect id="rect2986" width="10" height="30" x="20" y="0" rx="3" ry="3" />
                <rect id="rect2987" width="10" height="30" x="40" y="0" rx="3" ry="3" />
            </svg>
        </div>
    `
})
export class LoadingWidgetComponent {
    @Input() show = true;
}
