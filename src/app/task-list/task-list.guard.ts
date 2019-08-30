import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { SettingsService } from '../shared/settings.service';
import { RouterService } from '../shared/router.service';

@Injectable({
    providedIn: 'root',
})
export class TaskListGuard implements CanActivate {

    constructor(
        private settings: SettingsService,
        private router: RouterService,
    ) {}

    canActivate() {
        if (this.settings.path) {
            return true;
        } else {
            this.router.navigate(['/settings']);
            return false;
        }
    }
}
