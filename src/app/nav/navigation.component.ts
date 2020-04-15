import { Component } from '@angular/core'

import { APP_NAME } from '../app.constants'
import { NAVIGATION_MENU } from './nav'
import { getVersion } from '../shared/helpers/version'

@Component({
    selector: 'ms-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {

    appName = APP_NAME;
    appVersion = getVersion();
    navigationMenu = NAVIGATION_MENU;

}
