import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SqlBuilderComponent } from './sql-builder.component';
import { PopoverModule } from '../popover/popover.module';
import { IconsModule } from '../../icons/icons.module';
import { FormsModule } from '@angular/forms';
import { ExpressionBuilderModule } from '../expression-builder/expression-builder.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [CommonModule, PopoverModule, IconsModule, FormsModule, ExpressionBuilderModule, NgbModule],
    declarations: [SqlBuilderComponent],
    exports: [SqlBuilderComponent]
})
export class SqlBuilderModule {}
