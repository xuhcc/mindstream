import { Injectable, ViewContainerRef, NgZone } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';

import { Page } from 'tns-core-modules/ui/page';

@Injectable({
    providedIn: 'root',
})
export class RouterService {

    constructor(
        private router: RouterExtensions,
        private ngZone: NgZone,
    ) { }

    navigate(parameters: any[]) {
        this.router.navigate(parameters);
    }

    backToPreviousPage() {
        this.router.backToPreviousPage();
    }

    onNavigatedTo(container: ViewContainerRef, handler: () => void) {
        const page = container.injector.get(Page);
        page.on('navigatedTo', () => {
            // Trigger change detection
            this.ngZone.run(handler);
        });
    }

    onNavigatingFrom(container: ViewContainerRef, handler: () => void) {
        const page = container.injector.get(Page);
        page.on('navigatingFrom', handler);
    }
}
