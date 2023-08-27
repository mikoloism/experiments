import * as fs from 'node:fs';
import * as path from 'node:path';

function to_lines(text) {
    return new Promise(function (resolve) {
        const REGEX_MARKDOWN_ROWS =
            /\|(\s+[A-Za-z0-9 -_*#@$%:;?!.,\/\\]+\s+)[\|]?(\s+[A-Za-z0-9 -_*#@$%:;?!.,\/\\]+\s+)[\|]?(\s+[A-Za-z0-9 -_*#@$%:;?!.,\/\\]+\s+)\|\r?\n?/gm;
        const raw_table = text.match(REGEX_MARKDOWN_ROWS).join('\n');
        const lines = raw_table.split('\n').filter((line) => line);
        return resolve(lines);
    });
}

function to_json_fields(lines) {
    return new Promise(function (resolve) {
        const fields = lines[0]
            .split('|')
            .slice(1, -1)
            .map((field) => field.trim())
            .filter((field) => field);
        return resolve(fields);
    });
}

function to_json_rows(lines, fields) {
    return new Promise(function (resolve) {
        const rows = lines.slice(2).map((line) =>
            line
                .split('|')
                .slice(1, -1)
                .map((value) => value.trim())
                .filter((value) => value),
        );
        const result = rows.map((row) => {
            const data = {};
            row.map((value, index) => {
                Object.assign(data, { [fields[index]]: value });
            });
            return data;
        });
        return resolve(result);
    });
}

async function to_json(text) {
    const lines = await to_lines(text);
    const fields = await to_json_fields(lines);
    const rows = await to_json_rows(lines, fields);
    return { fields, rows };
}

function make_sort_json(rows) {
    return new Promise(function (resolve) {
        const result = rows.sort((a, b) => a['#'] - b['#']);
        return resolve(result);
    });
}

async function make_markdown_header(text) {
    const lines = await to_lines(text);
    return lines.slice(0, 2).join('\n');
}

function make_markdown_rows(table) {
    let result = '';
    for (let row of table.rows) {
        result = result.concat('| ');
        for (let field of table.fields) {
            result = result.concat(row[field]).concat(' | ');
        }
        result = result.concat('\n');
    }
    return result;
}

async function make_markdown(raw_content, table) {
    const rows = make_markdown_rows(table);
    const header = await make_markdown_header(raw_content);
    return header.concat('\n').concat(rows);
}

function replace_markdown_table(raw_content, markdown_table) {
    return new Promise(function (resolve) {
        const REGEX_MARKDOWN_TABLE =
            /(\|(\s+[A-Za-z0-9 -_*#@$%:;?!.,\/\\]+\s+)[\|]?(\s+[A-Za-z0-9 -_*#@$%:;?!.,\/\\]+\s+)[\|]?(\s+[A-Za-z0-9 -_*#@$%:;?!.,\/\\]+\s+)\|\r?\n?)?/gm;
        const REGEX_NEW_ITEM_PLACEHOLDER = /\s*<\!\-\- NEW_SOLUTION_ITEMS \-\->/gm;
        const NEW_ITEM_PLACEHOLDER = '<!-- NEW_SOLUTION_ITEMS -->';

        const result = raw_content
            .replace(REGEX_MARKDOWN_TABLE, '')
            .replace(
                REGEX_NEW_ITEM_PLACEHOLDER,
                '\n\n'.concat(markdown_table).concat(NEW_ITEM_PLACEHOLDER),
            );

        return resolve(result);
    });
}

async function sort_markdown_table(raw_content) {
    const table = await to_json(raw_content);
    const sorted_rows = await make_sort_json(table.rows);
    const sorted_table = Object.assign({}, table, { rows: sorted_rows });
    const markdown_table = await make_markdown(raw_content, sorted_table);
    const sorted_markdown = await replace_markdown_table(raw_content, markdown_table);
    return sorted_markdown;
}

export { sort_markdown_table };
