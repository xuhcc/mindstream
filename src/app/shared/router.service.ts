import { Location } from '@angular/common'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

@Injectable({
    providedIn: 'root',
})
export class RouterService {

    constructor(
        private location: Location,
        private router: Router,
    ) { }

    navigate(parameters: any[], extras?: any) {
        this.router.navigate(parameters, extras)
    }

    backToPreviousPage() {
        this.location.back()
    }
}
