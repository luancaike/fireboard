import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverModule } from '../popover/popover.module';
import { IconsModule } from '../../icons/icons.module';
import { FormsModule } from '@angular/forms';
import { ExpressionBuilderComponent } from './expression-builder.component';

@NgModule({
    imports: [CommonModule, PopoverModule, IconsModule, FormsModule],
    declarations: [ExpressionBuilderComponent],
    exports: [ExpressionBuilderComponent]
})
export class ExpressionBuilderModule {}
