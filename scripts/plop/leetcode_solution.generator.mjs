/** @typedef {import('plop').PlopGeneratorConfig} PlopGeneratorConfig */
/** @type {PlopGeneratorConfig} solutionGenerator */
const leetcode_solution_generator = {
	description: 'generate leetcode.com solution tempalte',
	prompts: [
		{
			type: 'input',
			name: 'PROBLEM_SLUG',
			message: 'what is question slug?',
		},
		{
			type: 'list',
			name: 'PROBLEM_LANGUAGE',
			message: 'choose your language:',
			choices: [
				{ type: 'choice', name: 'TypeScript', value: 'typescript' },
				{ type: 'choice', name: 'JavaScript', value: 'javascript' },
				{ disabled: true, type: 'choice', name: 'Ruby', value: 'ruby' },
				{ disabled: true, type: 'choice', name: 'Rust', value: 'rust' },
				{ disabled: true, type: 'choice', name: 'Go', value: 'golang' },
				{ disabled: true, type: 'choice', name: 'PHP', value: 'php' },
				{ disabled: true, name: 'Python', value: 'python3' },
				{ disabled: true, type: 'choice', name: 'C#', value: 'csharp' },
				{ disabled: true, type: 'choice', name: 'Java', value: 'java' },
				{ disabled: true, type: 'choice', name: 'C++', value: 'cpp' },
				{ disabled: true, type: 'choice', name: 'C', value: 'c' },
			],
		},
	],
	actions: [
		{ type: 'leetcode_fetch_problem' },
		{
			type: 'add',
			path: 'solutions/leetcode/{{PROBLEM_ID}}. {{PROBLEM_TITLE}}/{{PROBLEM_MAIN_SOURCE}}',
			skipIfExists: true,
			templateFile: 'scripts/plop/templates/{{PROBLEM_MAIN_SOURCE}}.hbs',
		},
		{
			type: 'add',
			path: 'solutions/leetcode/{{PROBLEM_ID}}. {{PROBLEM_TITLE}}/{{PROBLEM_TEST_SOURCE}}',
			skipIfExists: true,
			templateFile: 'scripts/plop/templates/{{PROBLEM_TEST_SOURCE}}.hbs',
		},
		{
			type: 'add',
			path: 'solutions/leetcode/{{PROBLEM_ID}}. {{PROBLEM_TITLE}}/README.md',
			skipIfExists: true,
			templateFile: 'scripts/plop/templates/README.md.hbs',
		},
		{
			type: 'modify',
			path: 'solutions/leetcode/README.md',
			pattern: /\s*<\!\-\- NEW_SOLUTION_ITEMS \-\->/gm,
			template: `\n| {{PROBLEM_ID}} | [{{PROBLEM_TITLE}}](./{{> SolutionDirectoryPath }}/) | {{PROBLEM_DIFFICULTY}} |\n\n<!-- NEW_SOLUTION_ITEMS -->`,
		},
		{ type: 'sort_markdown_table', path: 'solutions/leetcode/README.md' },
	],
};

export { leetcode_solution_generator };
