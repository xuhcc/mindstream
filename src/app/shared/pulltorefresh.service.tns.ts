import { Injectable } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';

import { PullToRefresh } from '@nstudio/nativescript-pulltorefresh';

@Injectable({
    providedIn: 'root',
})
export class PullToRefreshService {

    constructor() {
        registerElement('PullToRefresh', () => PullToRefresh);
    }

    onRefresh(event, callback) {
        const pullRefresh = <PullToRefresh>event.object;
        setTimeout(() => {
            callback();
            pullRefresh.refreshing = false;
        }, 0);
    }
}
