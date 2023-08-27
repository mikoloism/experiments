function isValid(text: string): boolean {
    if (text.length <= 1) {
        return false;
    }

    if (text.length >= 10000) {
        return false;
    }

    if (text.length % 2 !== 0) {
        return false;
    }

    const pairs: Array<string> = [];

    for (let index = 0; index < text.length; index++) {
        if (text[index] === '(' || text[index] === '[' || text[index] === '{') {
            pairs.push(text[index]);
        } else {
            if (
                pairs.length === 0 ||
                (pairs[pairs.length - 1] === '{' && text[index] !== '}') ||
                (pairs[pairs.length - 1] === '[' && text[index] !== ']') ||
                (pairs[pairs.length - 1] === '(' && text[index] !== ')')
            ) {
                return false;
            } else {
                pairs.pop();
            }
        }
    }

    return pairs.length === 0;
}

export { isValid };
