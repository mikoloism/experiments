import Handlebars from 'handlebars';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import puppeteer from 'puppeteer';
import inquirer from 'inquirer';

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

class Api {
    async ask(question) {
        const answer = await inquirer.prompt(question);
        return answer[question.name];
    }

    async run(handler) {
        return handler.call(null, this);
    }

    async file(option) {
        throw '`file` method was not implemented';
    }
}

const DEFAULT_OPTION = {
    message: 'Select Creators -> ',
};

class App {
    constructor(option = null) {
        this.api = new Api();
        this.option = option || DEFAULT_OPTION;
    }

    #handlers = {};
    create(name, handler) {
        this.#handlers[name] = handler;
        return this;
    }

    async #askCreator() {
        const answers = await inquirer.prompt({
            type: 'list',
            name: 'CREATOR_NAME',
            message: this.option.message,
            choices: Object.keys(this.#handlers).map((key) => ({
                name: key,
                type: 'choice',
            })),
        });
        return answers['CREATOR_NAME'];
    }

    async #runCreator(creator_name) {
        const creator_handler = this.#handlers[creator_name];
        return await creator_handler.call(null, this.api);
    }

    async end() {
        try {
            const creator_name = await this.#askCreator();
            const result = await this.#runCreator(creator_name);
            return result;
        } catch (error) {
            console.error(error);
        }
    }
}

function defineApp(option = null) {
    return new App(option);
}

export { get_page, make_url, render, readfile, writefile, defineApp };
