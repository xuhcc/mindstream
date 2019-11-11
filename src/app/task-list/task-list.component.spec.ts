import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListComponent } from './task-list.component';
import { FileService } from '../shared/file.service';
import { RouterService } from '../shared/router.service';
import { SettingsService } from '../shared/settings.service';

describe('TaskListComponent', () => {
    let component: TaskListComponent;
    let fixture: ComponentFixture<TaskListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaskListComponent],
            providers: [
                {provide: FileService, useValue: {read: () => 'test'}},
                {
                    provide: RouterService,
                    useValue: {
                        onNavigatedTo: () => {},
                        onNavigatingFrom: () => {},
                    },
                },
                {
                    provide: SettingsService,
                    useValue: {
                        path: 'test',
                        filter: {},
                        ordering: [],
                    },
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskListComponent);
        component = fixture.componentInstance;
        (component as any).fileSubscription = {unsubscribe: () => {}};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
