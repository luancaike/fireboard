import { ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LoadingBarService } from '../../service/loading-bar.service';

@Component({
    selector: 'fb-loading-bar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./loading-bar.component.scss'],
    templateUrl: './loading-bar.component.html'
})
export class LoadingBarComponent {
    @Input() isShow = false;
    constructor(public loadingBarService: LoadingBarService, private cdr: ChangeDetectorRef) {
        this.loadingBarService.isShow.subscribe((value) => {
            this.isShow = value;
            this.cdr.detectChanges();
        });
    }
}
