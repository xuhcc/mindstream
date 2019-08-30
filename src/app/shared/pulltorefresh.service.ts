import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PullToRefreshService {

    constructor() { }

    onRefresh(event, callback) {
        console.log(event);
        console.log(callback);
    }
}
