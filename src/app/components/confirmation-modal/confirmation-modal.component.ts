import { Component, ViewEncapsulation } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

@Component({
    selector: 'fb-confirmation-modal',
    encapsulation: ViewEncapsulation.None,
    template: `
        <div class="card border-0">
            <div class="card-header d-flex justify-content-between">
                <h6 style="margin: 0.5rem">
                    {{ message }}
                </h6>
                <button class="btn btn-sm btn-outline-dark close-modal" (click)="modal.close()">
                    <fa-icon icon="times"></fa-icon>
                </button>
            </div>
            <div class="card-footer text-muted d-flex justify-content-end">
                <button class="btn btn-outline-secondary mb-2" (click)="modal.close()">Cancelar</button>
                <button class="btn btn-danger ml-2 mb-2" (click)="confirmation()">Confirmar</button>
            </div>
        </div>
    `
})
export class ConfirmationModalComponent {
    callOnSuccess = () => null;
    modal: NgbModalRef;
    message = '';

    confirmation() {
        this.modal.close();
        this.callOnSuccess();
    }
}
