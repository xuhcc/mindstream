import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListComponent } from './task-list.component';
import { RouterService } from '../shared/router.service';

describe('TaskListComponent', () => {
    let component: TaskListComponent;
    let fixture: ComponentFixture<TaskListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaskListComponent],
            providers: [
                {
                    provide: RouterService,
                    useValue: {
                        onNavigatedTo: () => {},
                        onNavigatingFrom: () => {},
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
