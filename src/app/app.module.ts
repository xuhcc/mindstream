import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'

import { AngularMyDatePickerModule } from 'angular-mydatepicker'
import { NgxSmartModalModule } from 'ngx-smart-modal'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { NavigationComponent } from './nav/navigation.component'
import { DialogComponent } from './shared/dialog.component'
import { PlainTextComponent } from './plaintext/plaintext.component'
import { SettingsComponent } from './settings/settings.component'
import { TaskFormComponent } from './task-form/task-form.component'
import { TaskFormAutocompleteComponent } from './task-form/task-form-autocomplete.component'
import { TaskListComponent } from './task-list/task-list.component'
import { TagListComponent } from './tag-list/tag-list.component'
import { WelcomeComponent } from './welcome/welcome.component'
import { AboutComponent } from './about/about.component'

@NgModule({
    declarations: [
        AppComponent,
        NavigationComponent,
        DialogComponent,
        PlainTextComponent,
        SettingsComponent,
        TaskFormComponent,
        TaskFormAutocompleteComponent,
        TaskListComponent,
        TagListComponent,
        WelcomeComponent,
        AboutComponent,
    ],
    entryComponents: [
        DialogComponent,
    ],
    imports: [
        HttpClientModule,
        ReactiveFormsModule,
        BrowserModule,
        AngularMyDatePickerModule,
        NgxSmartModalModule.forRoot(),
        AppRoutingModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
