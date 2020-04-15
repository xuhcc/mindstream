import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core'

import { Subscription } from 'rxjs'

import { RouterService } from '../shared/router.service'
import { TaskFilter } from '../shared/settings'
import { SettingsService } from '../shared/settings.service'
import { SideDrawerService } from '../nav/sidedrawer.service'
import { TodoFileService } from '../shared/todo-file.service'
import { onNavigatedTo, onNavigatingFrom } from '../shared/helpers/page'

@Component({
    selector: 'ms-tag-list',
    templateUrl: './tag-list.component.html',
    styleUrls: ['./tag-list.component.scss'],
})
export class TagListComponent implements OnInit, OnDestroy {

    title = 'Tags';
    projects: string[] = [];
    contexts: string[] = [];
    private fileSubscription: Subscription;

    constructor(
        private router: RouterService,
        private settings: SettingsService,
        private sideDrawer: SideDrawerService,
        private todoFile: TodoFileService,
        private view: ViewContainerRef,
    ) { }

    ngOnInit() {
        this.todoFile.fileLoaded.then(() => this.updatePage())
        onNavigatedTo(this.view, () => {
            this.fileSubscribe()
        })
        onNavigatingFrom(this.view, () => {
            this.fileUnsubscribe()
        })
    }

    ngOnDestroy() {
        this.fileUnsubscribe()
    }

    private updatePage() {
        this.projects = this.todoFile.getProjects()
        this.contexts = this.todoFile.getContexts()
    }

    private fileSubscribe() {
        this.fileSubscription = this.todoFile.fileChanged.subscribe(() => {
            this.updatePage()
        })
    }

    private fileUnsubscribe() {
        this.fileSubscription.unsubscribe()
    }

    openDrawer() {
        this.sideDrawer.open(this.view)
    }

    showTaskList(filter: TaskFilter) {
        this.settings.filter = filter
        this.router.navigate(['/tasks'])
    }

    switchToTasks(event: any): void {
        if (event.direction !== 1) {
            return
        }
        this.router.navigate(['/tasks'])
    }

}
