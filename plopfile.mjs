'use strict';
import { leetcode_fetch_problem_action } from './scripts/plop/leetcode_fetch_problem.action.mjs';
import { leetcode_solution_generator } from './scripts/plop/leetcode_solution.generator.mjs';
import { solution_directory_path_partial } from './scripts/plop/solution_directory_path.partial.mjs';
import { sort_markdown_table_action } from './scripts/plop/sort_markdown_table.action.mjs';

/** @typedef {import('plop').NodePlopAPI} NodePlopAPI */
/** @param {NodePlopAPI} plop */
export default function plopfile(plop) {
    plop.setPartial('SolutionDirectoryPath', solution_directory_path_partial);
    plop.setActionType('sort_markdown_table', sort_markdown_table_action);
    plop.setActionType('leetcode_fetch_problem', leetcode_fetch_problem_action);
    plop.setGenerator('Solution (LeetCode.com)', leetcode_solution_generator);
}
