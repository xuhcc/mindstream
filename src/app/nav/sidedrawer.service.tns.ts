import { Injectable, NgZone, ViewContainerRef } from '@angular/core';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { RouterExtensions } from 'nativescript-angular/router';

import { getVersionNameSync } from 'nativescript-appversion';
import { TnsSideDrawerClass } from 'nativescript-foss-sidedrawer';
import { Color } from 'tns-core-modules/color';
import { isAndroid, isIOS } from 'tns-core-modules/platform';

import { NavModalComponent } from './nav-modal.component';
import { APP_NAME } from '../shared/constants';

@Injectable({
    providedIn: 'root',
})
export class SideDrawerService {

    private navigationMenu = [
        {
            title: 'Tasks',
            url: '/tasks',
        },
        {
            title: 'Projects',
            url: '/projects',
        },
        {
            title: 'Plain text',
            url: '/plaintext',
        },
        {
            title: 'Settings',
            url: '/settings',
        },
    ];

    private drawer: TnsSideDrawerClass;
    loaded: Promise<void>;

    constructor(
        private ngZone: NgZone,
        private router: RouterExtensions,
        private modalService: ModalDialogService,
    ) {
        if (isAndroid) {
            this.createAndroidDrawer();
        }
    }

    open(viewContainerRef?: ViewContainerRef) {
        if (isAndroid) {
            this.drawer.open();
        } else if (isIOS) {
            this.openModalNav(viewContainerRef);
        }
    }

    private createAndroidDrawer() {
        this.drawer = new TnsSideDrawerClass();

        const config = {
            title: APP_NAME,
            subtitle: `v${getVersionNameSync()}`,
            templates: this.navigationMenu,
            headerTextColor: new Color('#FBFCF0'), // $header-text-color
            textColor: new Color('#000000'), // $text-color
            headerBackgroundColor: new Color('#333333'), // $header-color
            backgroundColor: new Color('#FBFCF0'), // $page-color
            listener: (index: number) => {
                const url = this.navigationMenu[index].url;
                // Use NgZone because this is a callback from external JS library
                this.ngZone.run(() => {
                    this.router.navigateByUrl(url);
                });
            },
        };
        this.loaded = new Promise((resolve) => {
            // https://gitlab.com/burke-software/nativescript-foss-sidedrawer/issues/2
            setTimeout(() => {
                this.drawer.build(config);
                resolve();
            }, 0);
        });
    }

    private openModalNav(viewContainerRef: ViewContainerRef) {
        const options: ModalDialogOptions = {
            viewContainerRef: viewContainerRef,
            context: this.navigationMenu,
        };
        this.modalService.showModal(NavModalComponent, options).then((url: string) => {
            // Navigation is not working in callback
            // https://github.com/NativeScript/nativescript-angular/issues/1380
            setTimeout(() => {
                this.router.navigateByUrl(url);
            }, 50);
        });
    }
}
