import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StyleEditorComponent } from './style-editor.component';
import { IconsModule } from '../../icons/icons.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, IconsModule, FormsModule],
    declarations: [StyleEditorComponent],
    exports: [StyleEditorComponent]
})
export class StyleEditorModule {}
