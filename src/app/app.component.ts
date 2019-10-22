import { Component } from '@angular/core';

import { NAVIGATION_MENU } from './nav/nav';

@Component({
    selector: 'ms-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {

    navigationMenu = NAVIGATION_MENU;
}
