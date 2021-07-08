import { NgModule } from '@angular/core';
import { FbIconComponent } from './icon.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [CommonModule],
    declarations: [FbIconComponent],
    exports: [FbIconComponent]
})
export class IconsModule {}
