import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { RouterService } from '../shared/router.service';
import { WelcomeComponent } from './welcome.component';

describe('WelcomeComponent', () => {
    let component: WelcomeComponent;
    let fixture: ComponentFixture<WelcomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [WelcomeComponent],
            imports: [ReactiveFormsModule],
            providers: [
                {provide: RouterService, useValue: {}},
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WelcomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
