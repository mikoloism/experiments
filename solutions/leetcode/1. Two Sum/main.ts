function twoSum(nums: number[], target: number): number[] {
    let result: number[] = [];

    for (let left = 0; left < nums.length; left++) {
        for (let right = nums.length; right > left; right--) {
            const leftValue = nums[left];
            const rightValue = nums[right];
            const value = leftValue + rightValue;
            if (value == target) {
                result = [left, right];
                return result;
            }
        }
    }

    return result;
}

export { twoSum };
