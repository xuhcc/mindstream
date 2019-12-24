import { Component, ViewContainerRef } from '@angular/core';

import { APP_NAME } from '../app.constants';
import { SideDrawerService } from '../nav/sidedrawer.service';
import { getVersion } from '../shared/helpers/version';

@Component({
    selector: 'ms-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
})
export class AboutComponent {

    title = 'About';
    appName = APP_NAME;
    appVersion = getVersion();
    description = 'Task management app, built on todo.txt';
    bugTracker = 'https://github.com/xuhcc/mindstream/issues';

    constructor(
        private sideDrawer: SideDrawerService,
        private view: ViewContainerRef,
    ) {}

    openDrawer() {
        this.sideDrawer.open(this.view);
    }

    getBugTrackerLink(): string {
        return `<a href="${this.bugTracker}">Report bug</a>`;
    }
}
