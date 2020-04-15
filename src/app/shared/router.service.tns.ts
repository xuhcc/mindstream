import { Injectable } from '@angular/core'
import { RouterExtensions } from '@nativescript/angular/router'

@Injectable({
    providedIn: 'root',
})
export class RouterService {

    constructor(private router: RouterExtensions) { }

    navigate(parameters: any[], extras?: any) {
        this.router.navigate(parameters, extras)
    }

    backToPreviousPage() {
        this.router.backToPreviousPage()
    }
}
