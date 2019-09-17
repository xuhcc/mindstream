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
}
