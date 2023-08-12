import { describe, test } from '../../common/test.generator.js';
import { reverse } from './main.js';

describe('7. Reverse Integer', function testReverseInteger() {
	test('Case 1').input(123).expect(321).run(reverse);
	test('Case 2').input(-123).expect(-321).run(reverse);
	test('Case 3').input(120).expect(21).run(reverse);
});
