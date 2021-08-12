import { EventEmitter, Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
    public toasts: any[] = [];
    public onShow = new EventEmitter();

    show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
        const newToast = { textOrTpl, ...options };
        this.toasts.push(newToast);
        this.onShow.emit(newToast);
    }

    showError(textOrTpl: string | TemplateRef<any>, options: any = {}) {
        this.show(textOrTpl, { ...{ classname: 'bg-danger text-light' }, ...options });
    }

    remove(toast) {
        this.toasts = this.toasts.filter((t) => t !== toast);
    }
}
