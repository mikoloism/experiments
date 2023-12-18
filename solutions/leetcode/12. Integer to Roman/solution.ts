const ROMAN_MAP: Array<[number, string]> = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
];

function intToRoman(num: number): string {
    let romaned = '';
    for (let [value, symbol] of ROMAN_MAP) {
        let count = Math.floor(num / value);
        romaned = romaned.concat(symbol.repeat(count));
        num -= value * count;
    }
    return romaned;
}

export { intToRoman };
