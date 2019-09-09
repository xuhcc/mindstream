import { Injectable } from '@angular/core';

import { PullToRefresh } from '@nstudio/nativescript-pulltorefresh';

@Injectable({
    providedIn: 'root',
})
export class PullToRefreshService {

    constructor() {}

    onRefresh(event, callback) {
        const pullRefresh = <PullToRefresh>event.object;
        setTimeout(() => {
            callback();
            pullRefresh.refreshing = false;
        }, 0);
    }
}
