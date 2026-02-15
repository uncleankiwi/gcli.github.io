import {Colour} from "./util/Colour.js";
import {KeyState} from "./util/KeyState.js";
import {AnimationType, LogNode} from "./bash.js";
import type {AppOption} from "./util/AppOption";
import type {AppArgument} from "./util/AppArgument";

export function wrapColour(s: string | number | LogNode, colour: string | undefined) {
	let node;
	if (s instanceof LogNode) {
		node = s;
	}
	else {
		let text: string;
		if (typeof(s) === "number") {
			text = s.toString();
		}
		else {
			text = s;
		}
		node = new LogNode(text);
	}
	if (colour !== undefined) {
		node.colour = new Colour(colour);
	}
	return node;
}

export function makeRainbow(s: string | LogNode) {
	let node: LogNode;
	if (s instanceof LogNode) {
		node = s;
	}
	else {
		node = new LogNode(s);
	}
	node.animationType = AnimationType.RAINBOW;
	node.toAnimate = true;
	if (node.children !== undefined) {
		node.children.forEach(x => {
			x.toAnimate = true;
			x.animationType = AnimationType.RAINBOW;
		});
	}
	return node;
}

export enum ApplicationState {
	CLOSE,
	OPEN,
	OPEN_APPLICATION
}

//Generates light-shaded colour with some saturation
export function randomPastelColour() {
	let colour =
		new Colour(`rgb(${rand(120, 255)},${rand(120, 255)},${rand(120, 255)})`);
	if (colour.s < 0.2) {
		colour.changeSaturation(0.2);
	}
	return colour.raw;
}

//Generates an integer between x and y
export function rand(x: number, y: number) {
	return Math.floor(x + Math.random() * (y - x + 1));
}

//Returns a bunch of spaces for indentation and such
export function spaces(n: number) {
	return "&nbsp;".repeat(n);
}

//Attempts to pad spaces to the left of the string such that the string's centre is about 'length' characters
//from the left.
export function padToCentre(str: string) {
	let spacesToPad = Math.floor(20 - (stripHtml(str).length / 2));
	for (let i = 0; i < spacesToPad; i++) {
		str = "&nbsp;" + str;
	}
	return str;
}

//Removes the HTML tags from a string - otherwise padToCentre will count characters in there as well.
function stripHtml(str: string) {
	return (new DOMParser().parseFromString(str, 'text/html').body.textContent) || "";
}

export function wrapRandomPastelColour(str: string) {
	return wrapColour(str, randomPastelColour());
}

export function wrapCharsWithPastelAndRainbow(str: string) {
	let output: LogNode[] = [];
	for (let i = 0; i < str.length; i++) {
		output.push(makeRainbow(wrapRandomPastelColour(str.charAt(i))));
	}
	return new LogNode(output);
}

export class Application {
	static EXIT = "exit";
	static QUIT = "quit";

	/*
	When displaying help <applicationName>, it should be formatted as below (note indentation).
	Options are not hardcoded into the application, instead they are written into options
	together with the parameter name, and whether it is hidden (should not appear on help, default false).
	They appear here only if the application has options.
	===
user:~$ help applicationName
applicationName: optionsString
	shortHelp

	longHelp

	Options:
	  -a param	some explanation.
	  -b 		more text.
	  -c		some more text.
	 */
	static applicationName: string;
	static optionsString: string = Application.applicationName;
	static shortHelp: string = "No short description available.";
	static longHelp = ["No additional info available for this application."];
	static appOptions: AppOption[] = [];
	static appArguments: AppArgument[] = [];
	state: number = ApplicationState.OPEN;

	evaluate(command: string) {
		if (command === Application.EXIT || command === Application.QUIT) {
			this.state = ApplicationState.CLOSE;
		}
	}

	redraw() {

	}

	prompt(): (string | LogNode)[] {
		return [""];
	}

	//Used for detecting key combinations like ctrl+C.
	onKeyDown(keyState: KeyState, e: KeyboardEvent) {

	}
}