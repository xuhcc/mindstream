import { Injectable, NgZone, ViewContainerRef } from '@angular/core'
import { ModalDialogOptions, ModalDialogService, RouterExtensions } from '@nativescript/angular'

import { TnsSideDrawerClass } from 'nativescript-foss-sidedrawer'
import { Color } from '@nativescript/core/color'
import { isAndroid, isIOS } from '@nativescript/core/platform'

import { NavModalComponent } from './nav-modal.component'
import { NAVIGATION_MENU } from './nav'
import { APP_NAME } from '../app.constants'
import { getVersion } from '../shared/helpers/version'

// https://developer.android.com/reference/android/support/v4/widget/DrawerLayout.html
const LOCK_MODE_LOCKED_CLOSED = 1
const LOCK_MODE_UNDEFINED = 3

@Injectable({
    providedIn: 'root',
})
export class SideDrawerService {

    private drawer: TnsSideDrawerClass;
    loaded: Promise<void>;

    constructor(
        private ngZone: NgZone,
        private router: RouterExtensions,
        private modalService: ModalDialogService,
    ) {
        if (isAndroid) {
            this.createAndroidDrawer()
        }
    }

    open(viewContainerRef?: ViewContainerRef) {
        if (isAndroid) {
            this.drawer.open()
        } else if (isIOS) {
            this.openModalNav(viewContainerRef)
        }
    }

    private createAndroidDrawer() {
        this.drawer = new TnsSideDrawerClass()

        const config = {
            title: APP_NAME,
            subtitle: `v${getVersion()}`,
            templates: NAVIGATION_MENU,
            headerTextColor: new Color('#FBFCF0'), // $header-text-color
            textColor: new Color('#000000'), // $text-color
            headerBackgroundColor: new Color('#333333'), // $header-color
            backgroundColor: new Color('#FBFCF0'), // $page-color
            listener: (index: number) => {
                const url = NAVIGATION_MENU[index].url
                // Use NgZone because this is a callback from external JS library
                this.ngZone.run(() => {
                    this.router.navigateByUrl(url)
                })
            },
        }
        this.loaded = new Promise((resolve) => {
            // https://gitlab.com/burke-software/nativescript-foss-sidedrawer/issues/2
            setTimeout(() => {
                this.drawer.build(config)
                resolve()
            }, 0)
        })
    }

    private openModalNav(viewContainerRef: ViewContainerRef) {
        const options: ModalDialogOptions = {
            viewContainerRef: viewContainerRef,
            context: NAVIGATION_MENU,
        }
        this.modalService.showModal(NavModalComponent, options).then((url: string) => {
            // Navigation is not working in callback
            // https://github.com/NativeScript/nativescript-angular/issues/1380
            setTimeout(() => {
                this.router.navigateByUrl(url)
            }, 50)
        })
    }

    async lock() {
        if (isAndroid) {
            await this.loaded
            const layout = (this.drawer as any).drawer.getDrawerLayout()
            layout.setDrawerLockMode(LOCK_MODE_LOCKED_CLOSED)
        }
    }

    async unlock() {
        if (isAndroid) {
            await this.loaded
            const layout = (this.drawer as any).drawer.getDrawerLayout()
            layout.setDrawerLockMode(LOCK_MODE_UNDEFINED)
        }
    }
}
