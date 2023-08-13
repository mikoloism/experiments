import * as cheerio from 'cheerio';

/** @typedef {import('plop').NodePlopAPI} NodePlopAPI */
/** @param {NodePlopAPI} plop */
export default function plopfile(plop) {
	plop.setHelper('toProblemLink', function toProblemLink(text) {
		const REGEX = /\d+\.\s*(\w.+)/;
		return text.match(REGEX)?.[1];
	});

	function filterDescription(input) {
		const result = { EXAMPLES: [], DESCRIPTION: '' };

		function extractExamples(text) {
			const REGEX_EXAMPLE =
				/<p><strong class="example">Example\s*(?<EXAMPLE_INDEX>\d):*<\/strong><\/p>\s*<pre><strong>Input:<\/strong>(?<EXAMPLE_INPUT>.*?)\s*<strong>Output:<\/strong>(?<EXAMPLE_OUTPUT>.*?)\s*(<strong>Explanation:<\/strong>(?<EXAMPLE_EXPLANATION>.*?)\s*)?<\/pre>/gm;
			const matches = text.matchAll(REGEX_EXAMPLE);
			let match = matches.next();
			while (match.done === false) {
				const groups = match.value.groups;
				result.EXAMPLES.push({
					INDEX: groups.EXAMPLE_INDEX,
					INPUT: groups.EXAMPLE_INPUT.trim(),
					OUTPUT: groups.EXAMPLE_OUTPUT.trim(),
					EXPLANATION: (groups.EXAMPLE_EXPLANATION || '---').trim(),
				});
				match = matches.next();
			}
		}

		function escapeHtml(text) {
			const REGEX_USELESS_TAG =
				/(<p>|<\/p>|<ul>|<\/ul>|<\/li>|<ol>|<\/ol>|<\/sup>)/gm;
			const REGEX_EXAMPLES_ALL =
				/(<p><strong class="example">Example\s*(?<EXAMPLE_INDEX>\d):*<\/strong><\/p>\s*<pre><strong>Input:<\/strong>(?<EXAMPLE_INPUT>.*?)\s*<strong>Output:<\/strong>(?<EXAMPLE_OUTPUT>.*?)\s*(<strong>Explanation:<\/strong>(?<EXAMPLE_EXPLANATION>.*?)\s*)?<\/pre>\s+)+/gm;

			const escaped = text
				.replace(REGEX_EXAMPLES_ALL, '<!-- EXAMPLES -->')
				.replace(/<code>/gm, '`')
				.replace(/<\/code>/gm, '` ')
				.replace(REGEX_USELESS_TAG, '')
				.replace(/<strong>/gm, '**')
				.replace(/<\/strong>/gm, '** ')
				.replace(/<li>/gm, '- ')
				.replace(/<sup>/gm, '^')
				.replace(/&nbsp;/gm, '')
				.replace(/&lt;/gm, '<')
				.replace(/&gt;/gm, '>')
				.replace(/&quot;/gm, '"')
				.replace(/&#x27;/gm, "'")
				.replace(/&#x60;/gm, '`')
				.replace(/&#x3D;/gm, '=');

			result.DESCRIPTION = escaped;
		}

		extractExamples(input);
		escapeHtml(input);
		return result;
	}

	plop.setGenerator('problem', {
		description: 'LeetCode Problem Skeleton',
		prompts: [
			{
				type: 'input',
				name: 'PROBLEM_TITLE',
				message: 'what is problemn title?',
			},
			{
				type: 'input',
				name: 'ENTRY_POINT',
				message: 'what is problem entry point (main function)?',
				default: 'main',
			},
			{
				type: 'list',
				name: 'PROBLEM_DIFFICULTY',
				message: 'choice difficulty of problem?',
				choices: [
					{ type: 'choice', name: 'Easy' },
					{ type: 'choice', name: 'Medium' },
					{ type: 'choice', name: 'Hard' },
				],
			},
			{
				type: 'input',
				name: 'PROBLEM_LIKES',
				message: 'how much problem liked?',
			},
			{
				type: 'input',
				name: 'PROBLEM_DISLIKES',
				message: 'how much problem disliked?',
			},
			{
				type: 'editor',
				name: 'PROBLEM_DESCRIPTION',
				message: 'write problem description',
				filter(input) {
					return filterDescription(input);
				},
			},
		],
		actions: [
			{
				type: 'add',
				path: 'src/{{PROBLEM_TITLE}}/main.ts',
				skipIfExists: true,
				templateFile: 'scripts/plop-templates/main.ts.hbs',
			},
			{
				type: 'add',
				path: 'src/{{PROBLEM_TITLE}}/main.test.ts',
				skipIfExists: true,
				templateFile: 'scripts/plop-templates/main.test.ts.hbs',
			},
			{
				type: 'add',
				path: 'src/{{PROBLEM_TITLE}}/README.md',
				skipIfExists: true,
				templateFile: 'scripts/plop-templates/README.md.hbs',
			},
			{
				type: 'modify',
				path: 'src/{{PROBLEM_TITLE}}/README.md',
				pattern: '<!-- EXAMPLES -->',
				templateFile: 'scripts/plop-templates/README.examples.md.hbs',
			},
			{
				type: 'modify',
				path: 'src/{{PROBLEM_TITLE}}/README.md',
				pattern: '**Constraints:**',
				template: `### Constraints:`,
			},
		],
	});
}
