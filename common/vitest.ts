import { expect, it } from 'vitest';

interface CreateTestProps {
	caseName: string;
	inputValue: any[];
	expectValue: any;
	eq?: 'toBe' | 'toStrictEqual';
	fn: Function;
}

function createTest({
	caseName,
	inputValue,
	expectValue,
	eq,
	fn,
}: CreateTestProps) {
	const result = fn(...inputValue);
	it(`${caseName}\n\tInput:  ${inputValue.toString()}\n\tOutput: ${result}\n\tExpect: ${expectValue}`, function testCase() {
		expect(result)[eq || 'toBe'](expectValue);
	});
}

function test(caseName: string) {
	return {
		input(...inputValue: any[]) {
			return {
				expect(expectValue: any) {
					return {
						run(fn: Function, eq?: CreateTestProps['eq']) {
							createTest({
								caseName,
								inputValue,
								expectValue,
								eq,
								fn,
							});
						},
					};
				},
			};
		},
	};
}

export { describe } from 'vitest';
export { createTest, test };
