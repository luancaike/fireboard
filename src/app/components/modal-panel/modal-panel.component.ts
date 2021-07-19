import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';

@Component({
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ transform: 'translateY(100%)', opacity: 0 }),
                animate('0.3s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                style({ transform: 'translateY(0)', opacity: 1 }),
                animate('0.3s ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
            ])
        ])
    ],
    styles: [
        `
            .dps-modal-content {
                cursor: auto;
                -webkit-box-shadow: 3px -40px 50px 0 rgba(0, 0, 0, 0.3);
                box-shadow: 3px -40px 50px 0 rgba(0, 0, 0, 0.3);
                height: 650px;
                background: white;
                width: 100%;
            }

            .dps-modal-backdrop {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                height: 100vh;
                z-index: 1500;
                display: flex;
                justify-content: flex-end;
                flex-direction: column;
                cursor: not-allowed;
            }
        `
    ],
    selector: 'fb-modal-panel',
    template: `
        <div [@fadeInOut] *ngIf="showPainel" class="dps-modal-backdrop">
            <div class="dps-modal-content">
                <ng-content></ng-content>
            </div>
        </div>
    `
})
export class ModalPanelComponent {
    @Input() showPainel = false;
}
