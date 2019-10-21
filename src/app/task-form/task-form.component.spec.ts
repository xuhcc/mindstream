import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskFormComponent } from './task-form.component';
import { FileService } from '../shared/file.service';
import { RouterService } from '../shared/router.service';

describe('TaskFormComponent', () => {
    let component: TaskFormComponent;
    let fixture: ComponentFixture<TaskFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaskFormComponent],
            imports: [ReactiveFormsModule],
            providers: [
                {provide: FileService, useValue: {}},
                {provide: RouterService, useValue: {}},
                {provide: ActivatedRoute, useValue: {snapshot: {params: {}}}},
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
