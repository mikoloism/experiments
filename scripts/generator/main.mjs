import { generate as codewars_generator } from './codewars.mjs';
import { generate as leetcode_generator } from './leetcode.mjs';
import inquirer from 'inquirer';

async function main() {
    const generators = {
        codewars_generator,
        leetcode_generator,
    };

    const generator = await inquirer.prompt([
        {
            type: 'list',
            name: 'generator_name',
            message: 'choice generator :',
            choices: [
                { type: 'choice', name: 'Leetcode', value: 'leetcode_generator' },
                { type: 'choice', name: 'Codewars', value: 'codewars_generator' },
            ],
        },
    ]);

    await generators[generator.generator_name].call();
}

main().catch((error) => console.error(error));
