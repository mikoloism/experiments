const ROMAN_MAP = new Map<number, string>()
    .set(1000, 'M')
    .set(900, 'CM')
    .set(500, 'D')
    .set(400, 'CD')
    .set(100, 'C')
    .set(90, 'XC')
    .set(50, 'L')
    .set(40, 'XL')
    .set(10, 'X')
    .set(9, 'IX')
    .set(5, 'V')
    .set(4, 'IV')
    .set(1, 'I');

function intToRoman(num: number): string {
    let romaned = '';
    for (let [value, symbol] of ROMAN_MAP.entries()) {
        let count = Math.floor(num / value);
        romaned = romaned.concat(symbol.repeat(count));
        num -= value * count;
    }
    return romaned;
}

export { intToRoman };
