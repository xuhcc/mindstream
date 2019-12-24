import { Component } from '@angular/core';

import { NAVIGATION_MENU } from './nav';

@Component({
    selector: 'ms-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {

    navigationMenu = NAVIGATION_MENU;

}
