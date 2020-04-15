import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'

import { AngularMyDatePickerModule } from 'angular-mydatepicker'

import { TaskFormComponent } from './task-form.component'
import { TaskFormAutocompleteComponent } from './task-form-autocomplete.component'
import { DialogService } from '../shared/dialog.service'
import { FileService } from '../shared/file.service'
import { RouterService } from '../shared/router.service'
import { SettingsService } from '../shared/settings.service'

describe('TaskFormComponent', () => {
    let component: TaskFormComponent
    let fixture: ComponentFixture<TaskFormComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TaskFormComponent,
                TaskFormAutocompleteComponent,
            ],
            imports: [ReactiveFormsModule, AngularMyDatePickerModule],
            providers: [
                {provide: DialogService, useValue: {}},
                {provide: FileService, useValue: {read: () => 'test'}},
                {provide: RouterService, useValue: {}},
                {provide: ActivatedRoute, useValue: {snapshot: {params: {}}}},
                {
                    provide: SettingsService,
                    useValue: {path: 'test', filter: {}, ordering: []},
                },
            ],
        }).compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskFormComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
