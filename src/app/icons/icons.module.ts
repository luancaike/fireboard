import { NgModule } from '@angular/core';
import { FbIconComponent } from './icon.component';
import { CommonModule } from '@angular/common';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FaCustomIcons } from './icons';

@NgModule({
    imports: [CommonModule, FontAwesomeModule],
    declarations: [FbIconComponent],
    exports: [FbIconComponent, FontAwesomeModule]
})
export class IconsModule {
    constructor(library: FaIconLibrary) {
        library.addIconPacks(far, fas, fab);
        library.addIcons(...FaCustomIcons);
    }
}
