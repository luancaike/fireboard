import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'fb-loading-bar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./loading-bar.component.scss'],
    templateUrl: './loading-bar.component.html'
})
export class LoadingBarComponent {
    @Input() isShow = false;
}
