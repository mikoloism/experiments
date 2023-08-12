import { describe, test } from '../../common/test.generator.js';
import { isValid } from './main.js';

describe('20. Valid Parentheses', function runTest() {
	test('Case 1').input('()').expect(true).run(isValid);
	test('Case 2').input('()[]{}').expect(true).run(isValid);
	test('Case 3').input('(]').expect(false).run(isValid);
	test('Case 4').input('{[()]}').expect(true).run(isValid);
});
