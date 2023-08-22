import cheerio from 'cheerio';
import { get_page, make_url, render, writefile, readfile } from './common.mjs';
import inquirer from 'inquirer';
import * as path from 'node:path';

const URL_TEMPLATE = 'https://www.codewars.com/kata/{{ ID }}/train/{{ LANGUAGE }}';

async function extract_entry_point_name(raw_text) {
    const ENTRY_POINT_PATTERN = /export\s+function\s+(?<FUNCTION_NAME>.*?)\s*\(/gm;
    return new Promise(function promise(resolve) {
        const matches = ENTRY_POINT_PATTERN.exec(raw_text).groups;
        const entry_name = matches.FUNCTION_NAME || 'main';
        return resolve(entry_name);
    });
}

async function parse_json(raw_html, option) {
    return new Promise(async function promise(resolve) {
        const $ = cheerio.load(raw_html);
        const $train = $('#cc_play_view');
        const $game_title = $train.find('.game-title');
        const title = $game_title.find('h4').text().toString();
        const id = $game_title.find('[data-id]').data('id').toString();
        const description = $train.find('#description').html().toString();

        let source_code = '';
        const $source_code = $('#editors #code_container .CodeMirror-code');
        $source_code.children().each(function scrape_snippet(_, line) {
            const $line = $(line).children('.CodeMirror-line').text();
            source_code = source_code.concat($line).concat('\n');
        });

        let source_test = '';
        const $source_test = $('#editors #fixture .CodeMirror-code');
        $source_test.children().each(function scrape_snippet(_, line) {
            const $line = $(line).children('.CodeMirror-line').text();
            source_test = source_test.concat($line).concat('\n');
        });

        const url = await make_url(URL_TEMPLATE, { ID: id, LANGUAGE: option.language });
        const entry_name = await extract_entry_point_name(source_code);
        const output = {
            PROBLEM_ID: id,
            PROBLEM_TITLE: title,
            PROBLEM_URL: url,
            PROBLEM_DESCRIPTION: description,
            PROBLEM_CODE_SNIPPET: source_code,
            PROBLEM_TEST_SNIPPET: source_test,
            PROBLEM_ENTRY_POINT: entry_name,
        };
        return resolve(output);
    });
}

async function fetch(id, option) {
    const query = { ID: id, LANGUAGE: option.language };
    const url = await make_url(URL_TEMPLATE, query);
    const raw_html = await get_page(url);

    if (raw_html !== '') {
        const json = await parse_json(raw_html, option);
        return json;
    } else return null;
}

async function ask() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'write aka id :',
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
            dest: 'solutions/{{ PROBLEM_TITLE }}/README.md',
        },
        {
            source: 'scripts/plop/templates/main.ts.hbs',
            dest: 'solutions/{{ PROBLEM_TITLE }}/main.ts',
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

export { URL_TEMPLATE, fetch, parse_json, ask, generate };
