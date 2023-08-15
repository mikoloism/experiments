function reverse(x: number): number {
	let sign: number = 1;
	if (x < 0) {
		sign = -1;
		x *= -1;
	}
	let sum: number = 0;
	while (x > 0) {
		sum *= 10;
		const r: number = x % 10;
		x = Math.floor(x / 10);
		sum += r;
	}
	sum *= sign;
	if (sum < -Math.pow(2, 31) || sum > Math.pow(2, 31) - 1) {
		return 0;
	}
	return sum;
}

export { reverse };
