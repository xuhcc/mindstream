import { Routes } from '@angular/router';

import { PlainTextComponent } from './plaintext/plaintext.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { SettingsComponent } from './settings/settings.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskListGuard } from './task-list/task-list.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/tasks',
        pathMatch: 'full',
    },
    {
        path: 'plaintext',
        component: PlainTextComponent,
    },
    {
        path: 'settings',
        component: SettingsComponent,
    },
    {
        path: 'tasks',
        component: TaskListComponent,
        canActivate: [TaskListGuard],
    },
    {
        path: 'task-detail',
        component: TaskFormComponent,
    },
    {
        path: 'projects',
        component: ProjectListComponent,
    },
];
