import { describe, each } from '@/vitest.js';
import { isValid } from './main.js';

describe('20. Valid Parentheses', function runTest() {
	each([
		{ name: 'Case 1', input: ['()'], expect: true },
		{ name: 'Case 2', input: ['()[]{}'], expect: true },
		{ name: 'Case 3', input: ['(]'], expect: false },
		{ name: 'Case 4', input: ['{[()]}'], expect: true },
	]).test(isValid);
});
