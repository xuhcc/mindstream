import { Component, ViewContainerRef } from '@angular/core';

import { SideDrawerService } from '../nav/sidedrawer.service';
import { RouterService } from '../shared/router.service';
import { TodoFileService } from '../shared/todo-file.service';

@Component({
    selector: 'ms-plaintext',
    templateUrl: './plaintext.component.html',
    styleUrls: ['./plaintext.component.scss'],
})
export class PlainTextComponent {
    title = 'Plain Text';
    todo: string;

    constructor(
        private router: RouterService,
        public todoFile: TodoFileService,
        private sideDrawer: SideDrawerService,
        private viewContainerRef: ViewContainerRef,
    ) { }

    openDrawer() {
        this.sideDrawer.open(this.viewContainerRef);
    }
}
