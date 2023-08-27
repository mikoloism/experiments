import { describe, each } from '@/vitest.js';
import { twoSum } from './main.js';

describe('Two Sum', function runTest() {
    each([
        { name: 'Case 1', input: [[2, 7, 11, 15], 9], expect: [0, 1] },
        { name: 'Case 2', input: [[3, 2, 4], 6], expect: [1, 2] },
        { name: 'Case 3', input: [[3, 3], 6], expect: [0, 1] },
    ]).test(twoSum);
});
