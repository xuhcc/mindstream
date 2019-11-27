import { PullToRefresh } from '@nstudio/nativescript-pulltorefresh';

export function onPullRefresh(event, callback) {
    const pullRefresh = event.object as PullToRefresh;
    setTimeout(() => {
        callback();
        pullRefresh.refreshing = false;
    }, 0);
}
