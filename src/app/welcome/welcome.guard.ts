import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { RouterService } from '../shared/router.service';
import { SettingsService } from '../shared/settings.service';

@Injectable({
    providedIn: 'root',
})
export class WelcomeGuard implements CanActivate {

    constructor(
        private settings: SettingsService,
        private router: RouterService,
    ) {}

    canActivate(): boolean {
        if (this.settings.path) {
            // Skip welcome screen
            this.router.navigate(['/tasks']);
            return false;
        } else {
            return true;
        }
    }
}
