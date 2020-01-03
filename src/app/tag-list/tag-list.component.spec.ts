import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagListComponent } from './tag-list.component';
import { FileService } from '../shared/file.service';
import { RouterService } from '../shared/router.service';
import { SettingsService } from '../shared/settings.service';

describe('TagListComponent', () => {
    let component: TagListComponent;
    let fixture: ComponentFixture<TagListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TagListComponent],
            providers: [
                {provide: FileService, useValue: {read: () => 'test'}},
                {provide: RouterService, useValue: {}},
                {provide: SettingsService, useValue: {path: 'test'}},
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TagListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
