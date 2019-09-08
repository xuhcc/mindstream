import { compareEmptyGreater } from './misc';

describe('compareEmptyGreater function', () => {
    it('should correctly compare non-empty values', () => {
        expect(compareEmptyGreater('A', 'B')).toBe(-1);
        expect(compareEmptyGreater('B', 'A')).toBe(1);
        expect(compareEmptyGreater('A', 'A')).toBe(0);
    });

    it('should correctly compare empty values', () => {
        expect(compareEmptyGreater('A', '')).toBe(-1);
        expect(compareEmptyGreater('', 'A')).toBe(1);
        expect(compareEmptyGreater('', '')).toBe(0);
    });
});
