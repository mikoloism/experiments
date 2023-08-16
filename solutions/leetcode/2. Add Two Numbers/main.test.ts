import { describe, each } from "@/vitest.js";
import { ListNode } from "./list_node.js";
import { addTwoNumbers } from "./main.js";

describe("Add Two Numbers", function runTest() {
    each([
        {
            name: "Case 1",
            input: [
                new ListNode(2, new ListNode(4, new ListNode(3))),
                new ListNode(5, new ListNode(6, new ListNode(4))),
            ],
            expect: new ListNode(7, new ListNode(0, new ListNode(8))),
        },
        {
            name: "Case 2",
            input: [new ListNode(0), new ListNode(0)],
            expect: new ListNode(0),
        },
        {
            name: "Case 3",
            input: [
                new ListNode(
                    9,
                    new ListNode(
                        9,
                        new ListNode(
                            9,
                            new ListNode(
                                9,
                                new ListNode(9, new ListNode(9, new ListNode(9)))
                            )
                        )
                    )
                ),
                new ListNode(9, new ListNode(9, new ListNode(9, new ListNode(9)))),
            ],
            expect: new ListNode(
                8,
                new ListNode(
                    9,
                    new ListNode(
                        9,
                        new ListNode(
                            9,
                            new ListNode(
                                0,
                                new ListNode(0, new ListNode(0, new ListNode(1)))
                            )
                        )
                    )
                )
            ),
        },
    ]).test(addTwoNumbers);
});
