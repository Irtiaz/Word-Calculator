let word;
let n;
let splitted;
let types = [];
let supply = [];
let data = [];
let table;

let button, splitDiv;

function start() {
	button = document.getElementById('button');
	splitDiv = document.getElementById('split');
	if (button.textContent == 'Clear') {
		table.remove();
		table = undefined;
		splitDiv.textContent = "";
		types = [];
		supply = [];
		data = [];
		word = undefined;
		n = NaN;
		splitted = undefined;
		button.textContent = 'Solve';
		return;
	}

	word = document.getElementById('word').value;
	n = parseInt(document.getElementById('n').value);
	if (!isNaN(n)) {
		splitted = splitWord(word);

		splitDiv.textContent = "Splitting the word : " + splitted.toString().replace(/,/g, ' ');

		for (let sp of splitted) {
			types.push(sp.length);
		}
		for (let i = types[0]; i >= 1; --i) {
			let occurance = types.filter(x => x == i).length;
			supply[i] = occurance;
			if (supply[i + 1] != undefined) supply[i] += supply[i + 1];
		}



		const cases = partition(n, types[0]);
		for (let option of cases) {
			let example = "";
			let accepted = true;
			let cloned = types.slice();
			let clonedSplit = splitted.slice();
			let optionAllowed = true;
			for (let num of option) {
				let found = false;
				for (let i = 0; i < cloned.length; ++i) {
					if (cloned[i] >= num) {
						for (let p = 0; p < num; ++p) example += clonedSplit[i][0];
						cloned.splice(i, 1);
						clonedSplit.splice(i, 1);
						found = true;
						break;
					}
				}
				if (found == false) {
					optionAllowed = false;
					break;
				}
			}
			if (optionAllowed == true) {
				const demand = [];
				for (let num of option) {
					if (demand[num] == undefined) demand[num] = 1;
					else demand[num] ++;
				}
				//console.log(option);
				//console.log(demand);
				const opt = parseOption(demand);
				const combStr = parseCombination(demand);
				const permStr = parsePermutation(demand, combStr);
				const datam = [];
				datam.option = opt;
				datam.example = example;
				datam.combinationStr = combStr;
				datam.permutationStr = permStr;
				data.push(datam);
				//console.log(opt);
				//console.log(combStr);
				//console.log(permStr);
			}
		}
	}

	table = document.createElement('table');
	let row = table.insertRow(0);
	let cell1 = row.insertCell(0);
	let cell2 = row.insertCell(1);
	let cell3 = row.insertCell(2);
	let cell4 = row.insertCell(3);
	let cell5 = row.insertCell(4);
	cell1.textContent = "Serial no.";
	cell2.textContent = "Option";
	cell3.textContent = "Example";
	cell4.textContent = "Combination";
	cell5.textContent = "Permutation";

	let ypos = 1;

	for (let i = 0; i < data.length; ++i) {
		let newRow = table.insertRow(ypos++);
		let cells = [newRow.insertCell(0)];
		cells[0].textContent = i + 1;
		let xpos = 1;
		//console.log(data[i]);
		for (let key in data[i]) {
			let c = newRow.insertCell(xpos++);
			c.textContent = data[i][key];
		}
	}

	document.body.appendChild(table);
	MathJax.typeset();
	button.textContent = "Clear";
}


function splitWord(word) {
	let arr = [];
	for (let i = 0; i < word.length; ++i) {
		const c = word[i];
		let pos = undefined;
		for (let j = 0; j < arr.length; ++j) {
			if (arr[j][0] == c) pos = j;
		}
		if (pos == undefined) arr.push(c);
		else arr[pos] += c;
	}
	arr.sort((v1,v2) => v2.length - v1.length);
	return arr;
}

function partition(n, highest = n) {
	if (n == 1) return [[1]];
	else {
		let results = [];
		for (let i = 1; i <= Math.min(n, highest); ++i) {
			if (i == n) results.push([i]);
			else {
				const partitions = partition(n - i, i);
				for (let j = 0; j < partitions.length; ++j) {
					let part = partitions[j];
					part.unshift(i);
					results.push(part);
				}
			}
		}
		return results;
	}
}

function parseOption(demand) {
	if (demand.length == 2) return 'All different';
	else {
		let str = '';
		let repCount = 0;
		for (let i = 2; i < demand.length; ++i) {
			if (demand[i] != undefined)	repCount += demand[i];
		}
		if (repCount == 1) {
			for (let i = 2; i < demand.length; ++i) {
				let num = demand[i];
				if (num != undefined) {
					str += `${i} same, `
					break;
				}
			}
		}
		else {
			let typeNum = 1;
			for (let i = demand.length - 1; i >= 2; --i) {
				let num = demand[i];
				if (num != undefined) {
					for (let j = 0; j < num; ++j) {
						str += `${i} type-${typeNum}, `;
						typeNum ++;
					}
				}
			}
		}
		if (demand[1] != undefined) str += 'rest different';
		if (str[str.length - 2] == ',') {
			str = str.substr(0, str.length - 2);
		}
		return str;
	}
}

function parseCombination(demand) {
	let str = '';
	let sub = 0;
	for (let i = demand.length - 1; i >= 1; --i) {
		if (demand[i] != undefined) {
			//str = str + `${supply[i] - sub}C${demand[i]}.`;
			str += `\\(^${supply[i] - sub}C_${demand[i]}\\).`;
			sub += demand[i];
		}
	}
	str = str.substr(0, str.length - 1);
	return str;
}

function parsePermutation(demand, combinationStr) {
	let str = `${combinationStr.substr(0, combinationStr.length - 2)}.`;
	let divAdded = false;
	let division = "";
	for (let i = demand.length - 1; i >= 2; --i) {
		if (demand[i] != undefined) {
			let num = demand[i];
			//if (!divAdded) {
				//str += '/(';
				//divAdded = true;
			//}
			for (let j = 0; j < num; ++j) {
				division += `${i}!`;
			}
		}
	}
	//if (divAdded) str += ')';
	if (division) str += `\\frac{${n}!}{${division}}\\)`;
	else str += `${n}!\\)`;
	return str;
}
