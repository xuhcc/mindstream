import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { RouterService } from '../shared/router.service';
import { SettingsService } from '../shared/settings.service';
import { SideDrawerService } from '../nav/sidedrawer.service';
import { TodoFileService } from '../shared/todo-file.service';

@Component({
    selector: 'ms-project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit {

    title = 'Projects';
    projects: string[];

    constructor(
        private router: RouterService,
        private settings: SettingsService,
        private sideDrawer: SideDrawerService,
        private todoFile: TodoFileService,
        private view: ViewContainerRef,
    ) { }

    ngOnInit() {
        this.projects = this.todoFile.getProjects();
    }

    openDrawer() {
        this.sideDrawer.open(this.view);
    }

    showTaskList(project: string) {
        this.settings.filter = {project: project};
        this.router.navigate(['/tasks']);
    }

}
