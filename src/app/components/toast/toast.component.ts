import { ChangeDetectorRef, Component, HostBinding, OnDestroy, TemplateRef } from '@angular/core';
import { ToastService } from 'src/app/service/toast.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'fb-toasts',
    template: `
        <ngb-toast
            *ngFor="let toast of toastService.toasts"
            [class]="toast.classname"
            [autohide]="true"
            [delay]="toast.delay || 5000"
            (hide)="hide(toast)"
        >
            <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
                <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
            </ng-template>

            <ng-template #text>{{ toast.textOrTpl }}</ng-template>
        </ngb-toast>
    `
})
export class ToastComponent implements OnDestroy {
    @HostBinding('class.ngb-toasts') get host() {
        return true;
    }

    public onShow$: Subscription;

    constructor(public toastService: ToastService, public cdr: ChangeDetectorRef) {
        this.onShow$ = toastService.onShow.subscribe(() => cdr.detectChanges());
    }

    isTemplate(toast) {
        return toast.textOrTpl instanceof TemplateRef;
    }

    hide(toast) {
        this.toastService.remove(toast);
        this.cdr.detectChanges();
    }

    ngOnDestroy() {
        this.onShow$?.unsubscribe();
    }
}
