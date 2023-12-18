const ONES = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
const TENS = ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'];
const HNDS = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'];
const THSD = ['', 'M', 'MM', 'MMM'];

function intToRoman(num: number): string {
    return ''
        .concat(THSD[Math.floor(num / 1000)])
        .concat(HNDS[Math.floor((num % 1000) / 100)])
        .concat(TENS[Math.floor((num % 100) / 10)])
        .concat(ONES[num % 10]);
}

export { intToRoman };
