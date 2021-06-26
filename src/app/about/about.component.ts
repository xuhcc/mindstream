import { Component, ViewContainerRef } from '@angular/core'

import { APP_NAME } from '../app.constants'
import { SideDrawerService } from '../nav/sidedrawer.service'
import { isAndroid, isIOS, isWeb } from '../shared/helpers/platform'
import { getVersion } from '../shared/helpers/version'

const APP_DESCRIPTION = `
<p>Task management app, built on <a href="http://todotxt.org/" target="_blank">todo.txt</a>.</p>
<strong>Tips:</strong>
<ul>
    ${isAndroid || isIOS ? '<li>Press and hold on a task checkbox to see additional actions.</li>' : ''}
    ${isWeb ? '<li>Press A to add a new task from task list.</li>' : ''}
    <li>Add <code>h:1</code> tag to create a hidden task. You can define new projects, contexts and colors in it.</li>
    <li>Use backslash to prevent words starting with <code>+</code> or <code>@</code> from being parsed as projects or contexts: <code>\\+test \\@test</code>.</li>
</ul>
`

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
        this.sideDrawer.open(this.view)
    }

    getBugTrackerLink(): string {
        return `<a href="${this.bugTracker}">Report bug</a>`
    }
}
