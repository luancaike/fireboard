import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalPanelComponent } from './modal-panel.component';

@NgModule({
    imports: [CommonModule],
    declarations: [ModalPanelComponent],
    exports: [ModalPanelComponent]
})
export class ModalPanelModule {}
