import { Routes } from '@angular/router'

import { PlainTextComponent } from './plaintext/plaintext.component'
import { TagListComponent } from './tag-list/tag-list.component'
import { SettingsComponent } from './settings/settings.component'
import { TaskFormComponent } from './task-form/task-form.component'
import { TaskListComponent } from './task-list/task-list.component'
import { WelcomeComponent } from './welcome/welcome.component'
import { WelcomeGuard } from './welcome/welcome.guard'
import { AboutComponent } from './about/about.component'

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/welcome',
        pathMatch: 'full',
    },
    {
        path: 'welcome',
        component: WelcomeComponent,
        canActivate: [WelcomeGuard],
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
    },
    {
        path: 'task-detail',
        component: TaskFormComponent,
    },
    {
        path: 'tags',
        component: TagListComponent,
    },
    {
        path: 'about',
        component: AboutComponent,
    },
]
