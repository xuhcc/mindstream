import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';

import { Subscription } from 'rxjs';

import { RouterService } from '../shared/router.service';
import { SettingsService } from '../shared/settings.service';
import { SideDrawerService } from '../nav/sidedrawer.service';
import { TodoFileService } from '../shared/todo-file.service';
import { onNavigatedTo, onNavigatingFrom } from '../shared/helpers/page';

@Component({
    selector: 'ms-project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit, OnDestroy {

    title = 'Projects';
    projects: string[];
    private fileSubscription: Subscription;

    constructor(
        private router: RouterService,
        private settings: SettingsService,
        private sideDrawer: SideDrawerService,
        private todoFile: TodoFileService,
        private view: ViewContainerRef,
    ) { }

    ngOnInit() {
        this.todoFile.fileLoaded.then(() => this.createProjectList());
        onNavigatedTo(this.view, () => {
            this.fileSubscribe();
        });
        onNavigatingFrom(this.view, () => {
            this.fileUnsubscribe();
        });
    }

    ngOnDestroy() {
        this.fileUnsubscribe();
    }

    private createProjectList() {
        this.projects = this.todoFile.getProjects();
    }

    private fileSubscribe() {
        this.fileSubscription = this.todoFile.fileChanged.subscribe(() => {
            this.createProjectList();
        });
    }

    private fileUnsubscribe() {
        this.fileSubscription.unsubscribe();
    }

    openDrawer() {
        this.sideDrawer.open(this.view);
    }

    showTaskList(project: string) {
        this.settings.filter = {project: project};
        this.router.navigate(['/tasks']);
    }

}
