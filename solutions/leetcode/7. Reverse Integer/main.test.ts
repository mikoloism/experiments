import { describe, each } from '@/vitest.js';
import { reverse } from './main.js';

describe('7. Reverse Integer', function testReverseInteger() {
	each([
		{ name: 'Case 1', input: [123], expect: 321 },
		{ name: 'Case 2', input: [-123], expect: -321 },
		{ name: 'Case 3', input: [120], expect: 21 },
	]).test(reverse);
});
