import { defineApp } from './common.mjs';
import { generate as codewars_generator } from './codewars.mjs';
import { generate as leetcode_generator } from './leetcode.mjs';

defineApp()
    .create('leetcode', leetcode_generator)
    .create('codewars', codewars_generator)
    .end();
