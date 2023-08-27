import Handlebars from 'handlebars';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import puppeteer from 'puppeteer';
function render(template, data, option) {
    Handlebars.registerHelper('is_exist', function (v, o) {
        if (typeof v !== 'undefined') {
            return o.fn(this);
        } else {
            return o.inverse(this);
        }
    });

    if (typeof option === 'object' && option !== null) {
        if (typeof option['partials'] !== 'undefined') {
            Object.keys(option.partials).map(function (partialName) {
                const partialHandler = option.partials[partialName];
                Handlebars.registerPartial(partialName, partialHandler);
            });
        }

        if (typeof option['helpers'] !== 'undefined') {
            Object.keys(option.helpers).map(function (helperName) {
                const helperHandler = option.helpers[helperName];
                Handlebars.registerHelper(helperName, helperHandler);
            });
        }
    }
    return Handlebars.compile(template)(data);
}

async function make_url(template_url, data) {
    return new Promise(function promise(resolve) {
        return resolve(render(template_url, data));
    });
}

async function get_page(url) {
    let browser = null;
    try {
        browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' });
        const raw_html = await page.content();
        return raw_html;
    } catch (e) {
        throw e;
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
}

function get_directories(file_path) {
    return path.dirname(file_path);
}

async function readfile(source) {
    return await fs.readFile(source, { encoding: 'utf8' });
}

async function writefile(source, content) {
    const directories = get_directories(source);
    await fs.mkdir(directories, { recursive: true });
    return await fs.writeFile(source, content, { encoding: 'utf8' });
}

export { get_page, make_url, render, readfile, writefile };
