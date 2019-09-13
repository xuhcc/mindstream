import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class RouterService {

    constructor(private router: Router) { }

    navigate(parameters: any[]) {
        this.router.navigate(parameters);
    }

    backToPreviousPage() {
    }

    onNavigatedTo(container, handler: () => void) { // eslint-disable-line @typescript-eslint/no-unused-vars
        // Execute immediately
        handler();
    }

    onNavigatingFrom(container, handler: () => void) { // eslint-disable-line @typescript-eslint/no-unused-vars
        // Do nothing
    }
}
