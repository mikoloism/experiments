import { describe, each } from '@/vitest.js';
import { intToRoman } from './solution.js';

describe('Integer to Roman', function runTest() {
    each([
        { name: 'Case 1', input: [3], expect: 'III' },
        { name: 'Case 2', input: [58], expect: 'LVIII' },
        { name: 'Case 3', input: [1994], expect: 'MCMXCIV' },
    ]).test(intToRoman);
});
