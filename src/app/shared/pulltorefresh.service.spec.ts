import { TestBed } from '@angular/core/testing';

import { PullToRefreshService } from './pulltorefresh.service';

describe('PullToRefreshService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: PullToRefreshService = TestBed.get(PullToRefreshService);
        expect(service).toBeTruthy();
    });
});
