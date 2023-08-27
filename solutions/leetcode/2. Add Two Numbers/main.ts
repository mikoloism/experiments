import { ListNode } from './list_node.js';

/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    let result: ListNode = new ListNode(0);
    let carry: number = 0;

    let result_node: ListNode = result;
    let l1_node: ListNode | null = l1;
    let l2_node: ListNode | null = l2;
    while (l1_node !== null || l2_node !== null) {
        const sum = (l1_node?.val ?? 0) + (l2_node?.val ?? 0) + carry;
        carry = Math.floor(sum / 10);
        result_node.next = new ListNode(sum % 10);
        result_node = result_node.next;
        l1_node = l1_node?.next ?? null;
        l2_node = l2_node?.next ?? null;
    }

    if (carry > 0) {
        result_node.next = new ListNode(carry);
    }

    return result.next;
}

export { addTwoNumbers };
