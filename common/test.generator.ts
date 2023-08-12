import { expect, it } from 'vitest';

interface CreateTestProps {
	caseName: string;
	inputValue: any;
	expectValue: any;
	fn: Function;
}

function createTest({
	caseName,
	inputValue,
	expectValue,
	fn,
}: CreateTestProps) {
	const result = fn(inputValue);
	it(`${caseName}\n\tInput:  ${inputValue}\n\tOutput: ${result}\n\tExpect: ${expectValue}`, function testCase() {
		expect(result).toBe(expectValue);
	});
}

function test(caseName: string) {
	return {
		input(inputValue: any) {
			return {
				expect(expectValue: any) {
					return {
						run(fn: Function) {
							createTest({
								caseName,
								inputValue,
								expectValue,
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
