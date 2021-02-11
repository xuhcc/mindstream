import { Injectable } from '@angular/core'
import { CanActivate } from '@angular/router'

import { RouterService } from '../shared/router.service'
import { SettingsService } from '../shared/settings.service'

@Injectable({
    providedIn: 'root',
})
export class FileGuard implements CanActivate {

    constructor(
        private settings: SettingsService,
        private router: RouterService,
    ) {}

    canActivate(): boolean {
        if (this.settings.path) {
            return true
        } else {
            // Go back to welcome screen
            this.router.navigate(['/welcome'])
            return false
        }
    }
}
