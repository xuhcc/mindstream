import { Routes } from '@angular/router'

import { AboutComponent } from './about/about.component'
import { PlainTextComponent } from './plaintext/plaintext.component'
import { TagListComponent } from './tag-list/tag-list.component'
import { SettingsComponent } from './settings/settings.component'
import { TaskFormComponent } from './task-form/task-form.component'
import { TaskListComponent } from './task-list/task-list.component'
import { WelcomeComponent } from './welcome/welcome.component'

import { FileGuard } from './shared/file.guard'
import { WelcomeGuard } from './welcome/welcome.guard'

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
        canActivate: [FileGuard],
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [FileGuard],
    },
    {
        path: 'tasks',
        component: TaskListComponent,
        canActivate: [FileGuard],
    },
    {
        path: 'task-detail/:dueDaysFromNow',
        component: TaskFormComponent,
        canActivate: [FileGuard],
    },
    {
        path: 'task-detail',
        component: TaskFormComponent,
        canActivate: [FileGuard],
    },
    {
        path: 'tags',
        component: TagListComponent,
        canActivate: [FileGuard],
    },
    {
        path: 'about',
        component: AboutComponent,
        canActivate: [FileGuard],
    },
]
