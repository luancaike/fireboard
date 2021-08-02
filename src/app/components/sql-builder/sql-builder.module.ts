import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SqlBuilderComponent } from './sql-builder.component';
import { PopoverModule } from '../popover/popover.module';
import { IconsModule } from '../../icons/icons.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, PopoverModule, IconsModule, FormsModule],
    declarations: [SqlBuilderComponent],
    exports: [SqlBuilderComponent]
})
export class SqlBuilderModule {}
