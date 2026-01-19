// import {runGurgle} from "./gurgle";

const MAX_LINES = 20;	//Does not include the input line.
let log = [];
let currentInput = "";
let rowsFilled = 0;
// let cursorPos = 0;
let user= 'user@uncleankiwi.github.io';
let path = '~'
const directory = new Map([
	["gurgle", someFunction],
	["suso", someOtherFunc]]);
//

document.addEventListener('load', () => {
	drawLog();
});
document.addEventListener('keyup', (e) => {
	onKeyUp(e);
	drawLog();
});

function onKeyUp(e) {
	if (e.key.length === 1) {
		currentInput += e.key;
	}
	else if (e.key === 'Backspace') {
		currentInput = currentInput.substring(0, currentInput.length - 1);
	}
	else if (e.key === 'Enter') {
		printLine(decorateInput());
		evaluate(currentInput);
		currentInput = '';
	}
}

//Decorates the input line plus prefix (username and all), then appends log with it.
function printLine(str) {
	if (rowsFilled >= MAX_LINES) {
		for (let i = 1; i < rowsFilled; i++) {
			log[i - 1] = log[i];
		}
		rowsFilled = MAX_LINES;
		log[rowsFilled] = str;

	}
	else {
		log[rowsFilled] = str;
		rowsFilled++;
	}
}

function someOtherFunc(str) {
	printLine("some other func" + str);
}

function someFunction(str) {
	printLine("somefunc~" + str);
}

// export const printer = (s) => {printLine(s)};

function evaluate(command) {
	if (directory.has(command)) {
		directory.get(command)(currentInput);
	}
	else {
		printLine(currentInput + ': command not found');
	}
}

function decorateInput() {
	return wrapColour(user, '#55cc33') + ':' + wrapColour(path, '#5566ee') + '$ '
		+ currentInput;
}

function wrapColour(str, colour) {
	return '<span style="color: ' + colour + '">' + str + '</span>';
}

//Prints out every line of log.
function drawLog() {
	let output = "";
	for (let i = 0; i < rowsFilled; i++) {
		output += log[i] + '<br />';
	}
	output += decorateInput();
	document.getElementById('cmd').innerHTML = output;
}