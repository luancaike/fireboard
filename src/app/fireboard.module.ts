import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { FireboardComponent } from './fireboard.component';
import { CraftableModule } from 'ng-craftable';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { IconsModule } from './icons/icons.module';
import { WidgetsModule } from './widgets/widgets.module';
import { DatasourceSelectorComponent } from './components/datasource-selector/datasource-selector.component';

@NgModule({
    imports: [BrowserModule, FormsModule, WidgetsModule, IconsModule, CraftableModule, FontAwesomeModule],
    declarations: [FireboardComponent, DatasourceSelectorComponent],
    bootstrap: [FireboardComponent]
})
export class FireboardModule {
    constructor(library: FaIconLibrary) {
        library.addIconPacks(far, fas, fab);
    }
}
