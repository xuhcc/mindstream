import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { RouterService } from './router.service';

describe('RouterService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            {provide: Router, useValue: {}},
        ],
    }));

    it('should be created', () => {
        const service: RouterService = TestBed.get(RouterService);
        expect(service).toBeTruthy();
    });
});
