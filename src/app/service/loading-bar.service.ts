import { EventEmitter, Injectable } from '@angular/core';

import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadingBarService {
    public showLoadingBar = false;
    private _isShow = new EventEmitter();
    public isShow = this._isShow.pipe(distinctUntilChanged());

    showStatus(showLoadingBar: boolean) {
        this.showLoadingBar = showLoadingBar;
    }

    show() {
        this.showLoadingBar = true;
        this._isShow.emit(this.showLoadingBar);
    }

    hide() {
        this.showLoadingBar = false;
        this._isShow.emit(this.showLoadingBar);
    }
}
