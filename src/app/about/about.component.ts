import { Component, ViewContainerRef } from '@angular/core';

import { APP_NAME } from '../app.constants';
import { SideDrawerService } from '../nav/sidedrawer.service';
import { getVersion } from '../shared/helpers/version';

const APP_DESCRIPTION = `
Task management app, built on <a href="http://todotxt.org/" target="_blank">todo.txt</a>.
`;

@Component({
    selector: 'ms-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
})
export class AboutComponent {

    title = 'About';
    appName = APP_NAME;
    appVersion = getVersion();
    description = APP_DESCRIPTION;
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
