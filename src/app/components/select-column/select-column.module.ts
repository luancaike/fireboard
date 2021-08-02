import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectColumnComponent } from './select-column.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '../../icons/icons.module';

@NgModule({
    imports: [CommonModule, NgSelectModule, FormsModule, IconsModule],
    declarations: [SelectColumnComponent],
    exports: [SelectColumnComponent]
})
export class SelectColumnModule {}
