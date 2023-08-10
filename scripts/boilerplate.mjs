import fs, { read, readdirSync } from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { createInterface } from 'node:readline/promises';

const FILE_NAMES = ['README.md', 'main.ts', 'main.test.ts'];

const VARIABLE_REGEX = /\{[A-Z0-9_]{0,}\}/gm;

class List {
	#collection;

	constructor() {
		this.#collection = new Set();
	}

	add(value) {
		this.#collection.add(value);
	}

	toArray() {
		return Array.from(this.#collection);
	}
}

async function main() {
	console.log('BOILERPLATE');

	const currentPath = url
		.fileURLToPath(import.meta.url)
		.split(path.sep)
		.slice(0, -1)
		.join(path.sep);
	const boilerplatesPath = path.join(currentPath, 'boilerplates');
	const boilerplates = (
		await fs.promises.readdir(boilerplatesPath, { withFileTypes: true })
	)
		.filter(function filterDirectories(value) {
			return value.isDirectory() === true;
		})
		.map(function toObject(value) {
			return {
				name: value.name,
				path: path.join(boilerplatesPath, value.name),
			};
		});

	const args = process.argv.slice(2);
	const command = args[0];

	if (command === 'list') {
		console.log(`AVAILABLE BOILERPLATES:\n\n`, boilerplates);
		return;
	}

	const boilerplateName = args[0];
	const boilerplateTargetArg = args[1];
	const boilerplateTarget = path.join(process.cwd(), boilerplateTargetArg);
	const boilerplateSelected = boilerplates.find(function findBoilerplate(
		value,
	) {
		return value.name === boilerplateName;
	});
	const boilerplatePath = boilerplateSelected.path;

	console.log();
	console.log('SELECTED:');
	console.log('- name: ', boilerplateName);
	console.log('- from: ', boilerplatePath);
	console.log('- to:   ', boilerplateTarget);
	console.log();

	const vars = new List();

	function extractVarName(value) {
		const matches = Array.from(value.match(VARIABLE_REGEX));
		matches.map(function setVarName(varName) {
			vars.add(varName);
		});
	}

	function traverseToExtractVarContents(files = []) {
		for (let file of files) {
			const fileContents = fs.readFileSync(file.path, {
				encoding: 'utf8',
			});

			if (VARIABLE_REGEX.test(fileContents.toString())) {
				extractVarName(fileContents.toString());
			}
		}
	}

	function traverseToExtractVarName(entries = []) {
		for (let entry of entries) {
			if (VARIABLE_REGEX.test(entry.name.toString())) {
				extractVarName(entry.name.toString());
			}
		}
	}

	function traverseToDir(dir, allFiles = [], allDirs = []) {
		const files = fs
			.readdirSync(dir, { withFileTypes: true })
			.filter((f) => f.isFile())
			.map((f) => ({ name: f.name, path: path.join(dir, f.name) }));
		allFiles.push(...files);
		const dirs = fs
			.readdirSync(dir, { withFileTypes: true })
			.filter((f) => f.isDirectory())
			.map((f) => ({ name: f.name, path: path.join(dir, f.name) }));
		allDirs.push(...dirs);
		dirs.forEach((f) => {
			traverseToDir(f.path, allFiles, allDirs);
		});
		return { files: allFiles, dirs: allDirs };
	}

	const entries = traverseToDir(boilerplatePath.toString());
	traverseToExtractVarName(entries.dirs);
	traverseToExtractVarName(entries.files);
	traverseToExtractVarContents(entries.files);

	const varsMap = new Map();
	vars.toArray().map((variable) => {
		varsMap.set(variable, variable);
	});

	const readline = createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	for (let variableName of vars.toArray()) {
		await new Promise(async function recieveName(resolve) {
			const answer = await readline.question(
				`what is name of ${variableName} => `,
			);
			varsMap.set(variableName, answer);
			resolve();
		});
	}

	readline.close();
	console.log();

	for (let dir of entries.dirs) {
		await new Promise(async function createDir(resolve) {
			let targetPath = dir.path
				.toString()
				.replace(boilerplatesPath, boilerplateTarget)
				.replace(new RegExp(`${boilerplateName}\/`), '');

			for (let varName of vars.toArray()) {
				targetPath = targetPath.replace(varName, varsMap.get(varName));
			}

			console.log(`-> create directory\n  ${targetPath}`);
			await fs.promises.mkdir(targetPath);
			resolve();
		});
	}

	for (let file of entries.files) {
		await new Promise(async function createFile(resolve) {
			let targetPath = file.path
				.toString()
				.replaceAll(boilerplatesPath, boilerplateTarget)
				.replaceAll('.txt', '')
				.replace(new RegExp(`${boilerplateName}\/`), '');

			for (let varName of vars.toArray()) {
				targetPath = targetPath.replace(varName, varsMap.get(varName));
			}

			const contents = await fs.promises.readFile(file.path.toString(), {
				encoding: 'utf8',
			});

			let newContents = contents;
			for (let varName of vars.toArray()) {
				newContents = newContents.replaceAll(
					varName,
					varsMap.get(varName),
				);
			}

			console.log(`-> create file\n  ${targetPath}`);
			await fs.promises.writeFile(targetPath, newContents.toString(), {
				encoding: 'utf8',
			});
			resolve();
		});
	}

	console.log();
	console.log('-'.repeat(32));
	console.log(`CREATED SUCCESFULLY`);
}

main().catch((error) => console.log(error));
