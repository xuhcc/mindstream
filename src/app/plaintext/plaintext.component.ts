import { Component, ViewContainerRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core'

import { SideDrawerService } from '../nav/sidedrawer.service'
import { RouterService } from '../shared/router.service'
import { TodoFileService } from '../shared/todo-file.service'
import { isAndroid } from '../shared/helpers/platform'

@Component({
    selector: 'ms-plaintext',
    templateUrl: './plaintext.component.html',
    styleUrls: ['./plaintext.component.scss'],
})
export class PlainTextComponent {

    title = 'Plain text';

    @ViewChild('fileContent', {static: false})
    fileContent: ElementRef

    constructor(
        private router: RouterService,
        public todoFile: TodoFileService,
        private sideDrawer: SideDrawerService,
        private viewContainerRef: ViewContainerRef,
    ) { }

    ngAfterViewInit(): void {
        setTimeout(() => {
            if (isAndroid) {
                this.fileContent.nativeElement.android.setTextIsSelectable(true)
            }
        }, 100)
    }

    openDrawer() {
        this.sideDrawer.open(this.viewContainerRef)
    }
}
