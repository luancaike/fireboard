import { Injectable, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../components/confirmation-modal/confirmation-modal.component';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
    constructor(public modalService: NgbModal, public injector: Injector) {}

    show(message: string, callOnSuccess = () => null) {
        const modal = this.modalService.open(ConfirmationModalComponent, { centered: true, backdrop: 'static' });
        modal.componentInstance.callOnSuccess = callOnSuccess;
        modal.componentInstance.message = message;
        modal.componentInstance.modal = modal;
    }
}
