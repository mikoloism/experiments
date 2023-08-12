# [20. Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)

| Difficulty | Likes | UnLikes |
| ---------- | ----- | ------- |
| Easy       | 11.4K | 1.4K    |

## Problem

Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

An input string is valid if:

-   Open brackets must be closed by the same type of brackets.
-   Open brackets must be closed in the correct order.
-   Every close bracket has a corresponding open bracket of the same type.

### Examples:

| #   | Input          | Output  | Explanation |
| --- | -------------- | ------- | ----------- |
| 1   | `s = "()"`     | `true`  | `---`       |
| 2   | `s = "()[]{}"` | `true`  | `---`       |
| 3   | `s = "(]"`     | `false` | `---`       |

### Constraints:

-   `1 <= s.length <= 10^4`
-   `s` consists of parentheses only `'()[]{}'`.
