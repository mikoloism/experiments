import { LeetCode } from 'leetcode-query';
import { LANGUAGE_MAIN_FILE } from './filename.constants.mjs';

async function leetcode_fetch_problem_action(answers) {
    const leetcode = new LeetCode();
    await leetcode
        .problem(answers.PROBLEM_SLUG)
        .then(function fetchDataToStruct(problem) {
            const snippet = problem.codeSnippets.find(function (value) {
                return value.langSlug === answers.PROBLEM_LANGUAGE;
            });

            return {
                PROBLEM_ID: problem.questionId,
                PROBLEM_TITLE: problem.title,
                PROBLEM_URL: `https://leetcode.com/problems/${answers.PROBLEM_SLUG}/`,
                PROBLEM_DIFFICULTY: problem.difficulty,
                PROBLEM_DESCRIPTION: problem.content,
                PROBLEM_SNIPPET: snippet.code,
            };
        })
        .then(function extractEntryFunction(injectable) {
            let entryPoint = 'main';
            if (answers.PROBLEM_LANGUAGE === 'typescript') {
                const REGEX = /function\s+(?<FUNCTION_NAME>.*?)\s*\(/gm;
                const match = REGEX.exec(injectable.PROBLEM_SNIPPET).groups;
                entryPoint = match.FUNCTION_NAME || 'main';
            }

            return Object.assign({}, injectable, {
                PROBLEM_ENTRY_POINT: entryPoint,
            });
        })
        .then(function extractFileName(injectable) {
            const files = LANGUAGE_MAIN_FILE[answers.PROBLEM_LANGUAGE];
            return Object.assign({}, injectable, {
                PROBLEM_MAIN_SOURCE: files.main,
                PROBLEM_TEST_SOURCE: files.test,
            });
        })
        .then(function injectToAnswers(injectable) {
            Object.assign(answers, injectable);
        });

    return `Question Title : ${answers.PROBLEM_ID}. ${answers.PROBLEM_TITLE}`;
}

export { leetcode_fetch_problem_action };
