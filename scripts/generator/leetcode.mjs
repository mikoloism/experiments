import inquirer from 'inquirer';
import { LeetCode } from 'leetcode-query';
import * as path from 'node:path';
import { make_url, readfile, render, writefile } from './common.mjs';
import { LANGUAGE_MAIN_FILE } from './filename.constants.mjs';

const URL_TEMPLATE = 'https://leetcode.com/problems/{{ ID }}/';

async function extract_entry_point_name(raw_text) {
    const ENTRY_POINT_PATTERN = /function\s+(?<FUNCTION_NAME>.*?)\s*\(/gm;
    return new Promise(function promise(resolve) {
        const matches = ENTRY_POINT_PATTERN.exec(raw_text).groups;
        const entry_name = matches.FUNCTION_NAME || 'main';
        return resolve(entry_name);
    });
}

async function parse_json(problem, option) {
    const id = problem.questionId;
    const url = await make_url(URL_TEMPLATE, { ID: id });
    const source_code = problem.codeSnippets.find(function (snippet) {
        return snippet.langSlug === option.language;
    });
    const entry_name = await extract_entry_point_name(source_code.code);
    const files = LANGUAGE_MAIN_FILE[option.language];

    const output = {
        PROBLEM_ID: id,
        PROBLEM_TITLE: problem.title,
        PROBLEM_URL: url,
        PROBLEM_DIFFICULTY: problem.difficulty,
        PROBLEM_DESCRIPTION: problem.content,
        PROBLEM_CODE_SNIPPET: source_code.code,
        PROBLEM_ENTRY_POINT: entry_name,
        PROBLEM_MAIN_SOURCE: files.main,
        PROBLEM_TEST_SOURCE: files.test,
    };

    return output;
}

async function fetch(id, option) {
    const api = new LeetCode();
    const problem = await api.problem(id);
    const json = await parse_json(problem, option);
    return json;
}

async function ask() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'write slug id :',
        },
        {
            type: 'list',
            name: 'language',
            message: 'choice langauge: ',
            choices: [
                {
                    type: 'choice',
                    name: 'Typescript',
                    value: 'typescript',
                },
            ],
        },
    ]);

    return answers;
}

async function do_render(data) {
    const actions = [
        {
            source: 'scripts/plop/templates/README.md.hbs',
            dest: 'solutions/l-{{ PROBLEM_TITLE }}/README.md',
        },
        {
            source: 'scripts/plop/templates/main.ts.hbs',
            dest: 'solutions/l-{{ PROBLEM_TITLE }}/main.ts',
        },
    ];

    return await Promise.all(
        actions.map(async function (action) {
            const template = await readfile(action.source);
            const compiled_dest_path = render(action.dest, data);
            const content = render(template, data);
            const dest = path.join(process.cwd(), compiled_dest_path);
            await writefile(dest, content);
            return 'add - '.concat(compiled_dest_path);
        }),
    );
}

async function generate() {
    const { id, ...option } = await ask();
    const data = await fetch(id, option);
    const result = await do_render(data);
    result.map((message) => console.log(message));
}

export { URL_TEMPLATE, fetch, parse_json, do_render, generate, ask };
