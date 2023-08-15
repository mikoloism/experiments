function solution_directory_path_partial(data) {
	return encodeURI(
		'{{PROBLEM_ID}}. {{PROBLEM_TITLE}}'
			.replace('{{PROBLEM_ID}}', data.PROBLEM_ID)
			.replace('{{PROBLEM_TITLE}}', data.PROBLEM_TITLE),
	);
}

export { solution_directory_path_partial };
