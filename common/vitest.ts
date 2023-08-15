import { expect, test } from 'vitest';

interface TestCase {
	name: string;
	input: unknown[];
	expect: unknown;
}

function each(cases: ReadonlyArray<TestCase>) {
	return {
		test(fn: (...args: any[]) => unknown) {
			test.each(cases)(
				`\n  $name\n\tInput:  $input\n\tExpect: $expect`,
				function (item) {
					const result = fn.apply(null, item.input);
					expect(result).toStrictEqual(item.expect);
				},
			);
		},
	};
}

export { describe } from 'vitest';
export { each };
