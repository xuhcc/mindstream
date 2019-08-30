import { Injectable } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';

@Injectable({
    providedIn: 'root',
})
export class RouterService {

    constructor(private router: RouterExtensions) { }

    navigate(parameters: any[]) {
        this.router.navigate(parameters);
    }

    backToPreviousPage() {
        this.router.backToPreviousPage();
    }
}
