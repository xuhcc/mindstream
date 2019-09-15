import { PullToRefresh } from '@nstudio/nativescript-pulltorefresh';

export function onPullRefresh(event, callback) {
    const pullRefresh = <PullToRefresh>event.object;
    setTimeout(() => {
        callback();
        pullRefresh.refreshing = false;
    }, 0);
}
